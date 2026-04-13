type RecentTrack = {
  id: string;
  title: string;
  artists: string;
  sourceLabel: string;
  source: "spotify" | "youtube";
  coverImage?: string;
  href: string;
  playedAtDisplay: string;
};

type RecentTracksCarouselProps = {
  ariaLabel: string;
  title: string;
  description: string;
  emptyMessage: string;
  tracks: RecentTrack[];
};

export default function RecentTracksCarousel({
  ariaLabel,
  title,
  description,
  emptyMessage,
  tracks,
}: RecentTracksCarouselProps) {
  return (
    <section aria-label={ariaLabel}>
      <div className="carousel-section-heading">
        <h2 className="carousel-section-title">{title}</h2>
        <p className="carousel-section-description">{description}</p>
      </div>

      {tracks.length > 0 ? (
        <div className="recent-tracks-carousel">
          {tracks.map((track) => (
            <article key={track.id} className="recent-track-card">
              <div className="recent-track-cover-wrapper">
                {track.coverImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={track.coverImage}
                    alt={`${track.title} cover art`}
                    className="recent-track-cover-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="recent-track-cover-fallback">
                    {track.source === "spotify" ? "SP" : "YT"}
                  </div>
                )}
              </div>

              <div className="recent-track-content">
                <h2 className="recent-track-name">{track.title}</h2>
                <p className="recent-track-artists">{track.artists}</p>
                <p className="recent-track-played-at">
                  {track.sourceLabel} • {track.playedAtDisplay}
                </p>
                <a
                  href={track.href}
                  target="_blank"
                  rel="noreferrer"
                  className="recent-track-link"
                >
                  Open in {track.sourceLabel}
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="recent-tracks-empty-state">{emptyMessage}</p>
      )}
    </section>
  );
}

export type { RecentTrack };
