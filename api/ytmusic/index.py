from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from ytmusicapi import YTMusic
import json
import tempfile
import os
import re
from datetime import datetime, timedelta, timezone

class AuthHeaders(BaseModel):
    cookie: str
    authorization: str | None = None  # SAPISIDHASH — optional but improves reliability
    x_goog_authuser: str | None = "0"
    origin: str = "https://music.youtube.com"
 
 
class UserRequest(BaseModel):
    headers: AuthHeaders
    limit: int | None = 20

 
def create_ytmusic_client(headers: AuthHeaders) -> YTMusic:

    headers_dict = {
        "Cookie": headers.cookie,
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        ),
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type": "application/json",
        "X-Goog-AuthUser": headers.x_goog_authuser or "0",
        "Origin": headers.origin,
    }
 
    if headers.authorization:
        headers_dict["Authorization"] = headers.authorization
 
    # ytmusicapi can accept a filepath to a JSON headers file
    tmp = tempfile.NamedTemporaryFile(
        mode="w", suffix=".json", delete=False
    )
    json.dump(headers_dict, tmp)
    tmp.close()
 
    try:
        yt = YTMusic(tmp.name)
    except Exception as e:
        os.unlink(tmp.name)
        raise HTTPException(status_code=401, detail=f"Auth failed: {str(e)}")
 
    os.unlink(tmp.name)
    return yt
 
 
def extract_track_info(track: dict) -> dict:
    return {
        "title": track.get("title"),
        "artist": (
            ", ".join(a.get("name", "") for a in track.get("artists", []))
            if track.get("artists")
            else None
        ),
        "album": (
            track.get("album", {}).get("name")
            if isinstance(track.get("album"), dict)
            else track.get("album")
        ),
        "duration": track.get("duration"),
        "videoId": track.get("videoId"),
        "thumbnails": track.get("thumbnails", []),
        "played": track.get("played"),
        "playedAtEpochMs": track.get("playedAtEpochMs"),
        "source": "youtube_music",
    }


def parse_played_label_to_epoch_ms(label: str | None, index: int) -> int | None:
    if not label:
        return None

    normalized = label.strip().lower()
    now = datetime.now(timezone.utc)

    if normalized == "just now":
        return int((now - timedelta(seconds=index)).timestamp() * 1000)

    if normalized == "today":
        return int((now - timedelta(minutes=index * 5)).timestamp() * 1000)

    if normalized == "yesterday":
        return int((now - timedelta(days=1, minutes=index * 5)).timestamp() * 1000)

    relative_match = re.match(
        r"^(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago$",
        normalized,
    )
    if relative_match:
        amount = int(relative_match.group(1))
        unit = relative_match.group(2)
        delta_map = {
            "second": timedelta(seconds=amount),
            "minute": timedelta(minutes=amount),
            "hour": timedelta(hours=amount),
            "day": timedelta(days=amount),
            "week": timedelta(weeks=amount),
            "month": timedelta(days=30 * amount),
            "year": timedelta(days=365 * amount),
        }
        return int((now - delta_map[unit]).timestamp() * 1000)

    for pattern in (
        "%b %d, %Y",
        "%B %d, %Y",
        "%m/%d/%Y",
        "%Y-%m-%d",
        "%m/%d/%y",
    ):
        try:
            parsed = datetime.strptime(label.strip(), pattern).replace(tzinfo=timezone.utc)
            return int(parsed.timestamp() * 1000)
        except ValueError:
            continue

    return None

app = FastAPI()

BASE_PATH = "/api/ytmusic"
 
@app.get(f'{BASE_PATH}/health')
async def health_check(
    x_cookie: str = Header(...),
    x_authorization: str = Header(...),
):
    headers = AuthHeaders(
        cookie=x_cookie,
        authorization=x_authorization,
    )
    yt = create_ytmusic_client(headers)

    try:
        yt.get_library_songs(limit=1)
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Auth failed: {str(e)}")

    return {"status": "ok", "service": "ytmusic"}
 
 
@app.post(f'{BASE_PATH}/history')
async def get_history(req: UserRequest):
    yt = create_ytmusic_client(req.headers)
 
    try:
        history = yt.get_history()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")

    tracks = []
    for index, track in enumerate(history[: req.limit]):
        played_at_epoch_ms = parse_played_label_to_epoch_ms(track.get("played"), index)
        if played_at_epoch_ms is not None:
            played_at_epoch_ms -= index * 1000

        track["playedAtEpochMs"] = played_at_epoch_ms
        tracks.append(extract_track_info(track))

    return {"tracks": tracks, "count": len(tracks)}
 
 
@app.post(f'{BASE_PATH}/top-tracks')
async def get_top_tracks(req: UserRequest):
    yt = create_ytmusic_client(req.headers)
 
    try:
        liked = yt.get_liked_songs(limit=req.limit or 100)
        tracks_raw = liked.get("tracks", [])
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch top tracks: {str(e)}"
        )
 
    tracks = [extract_track_info(t) for t in tracks_raw]
    return {"tracks": tracks, "count": len(tracks)}

