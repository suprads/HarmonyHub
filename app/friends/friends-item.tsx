"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { User } from "@/generated/prisma/browser";
import styles from "./friends.module.css";
import { getHandleByUserId } from "@/services/db/user";

type Friend = Pick<User, "id" | "handle" | "email" | "image">;

interface UserSearchResult {
  id: string;
  handle: string;
  image?: string | null;
}

interface FriendsItemProps {
  initialFriends: Friend[];
}

export default function FriendsItem({ initialFriends }: FriendsItemProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFriends, setFilteredFriends] =
    useState<Friend[]>(initialFriends);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sendingRequestTo, setSendingRequestTo] = useState<string | null>(null);
  const [removingFriendId, setRemovingFriendId] = useState<string | null>(null);
  const [friendToRemove, setFriendToRemove] = useState<Friend | null>(null);

  const getAvatarFallback = (handle: string | null | undefined) =>
    handle?.substring(0, 2).toUpperCase() || "??";

  useEffect(() => {
    if (searchTerm) {
      const filtered = friends.filter((friend) =>
        friend.handle?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredFriends(filtered);
    } else {
      setFilteredFriends(friends);
    }
  }, [searchTerm, friends]);

  useEffect(() => {
    const searchUsers = async () => {
      if (userSearchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/users/search?q=${encodeURIComponent(userSearchQuery)}`,
        );
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.users || []);
        }
      } catch (error) {
        console.error("Failed to search users:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [userSearchQuery]);

  const handleAddFriend = () => {
    setIsAddFriendOpen(true);
    setUserSearchQuery("");
    setSearchResults([]);
  };

  const handleSendFriendRequest = async (userId: string) => {
    setSendingRequestTo(userId);
    try {
      const response = await fetch("/api/friends/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receiverId: userId }),
      });

      if (response.ok) {
        alert("Friend request sent successfully!");
        setSearchResults((prev) => prev.filter((user) => user.id !== userId));
      } else {
        const error = await response.json();
        alert(error.error || "Failed to send friend request");
      }
    } catch (error) {
      console.error("Failed to send friend request:", error);
      alert("Failed to send friend request");
    } finally {
      setSendingRequestTo(null);
    }
  };

  const handleViewFriend = async (userId: string) => {
    const params = new URLSearchParams(searchParams);
    const friend = await getHandleByUserId(userId);
    const handle = friend ? friend : "unknown";
    params.set("handle", handle);
    router.push(`http://127.0.0.1:3000/profile/view?${params.toString()}`);
  };

  const handleRemoveFriend = async (friendId: string) => {
    setRemovingFriendId(friendId);
    try {
      const response = await fetch("/api/friends/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId }),
      });

      if (response.ok) {
        setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
      } else {
        const error = await response.json();
        alert(error.error || "Failed to remove friend");
      }
    } catch (error) {
      console.error("Failed to remove friend:", error);
      alert("Failed to remove friend");
    } finally {
      setRemovingFriendId(null);
    }
  };

  const handleOpenRemoveDialog = (friend: Friend) => {
    setFriendToRemove(friend);
  };

  const handleConfirmRemoveFriend = async () => {
    if (!friendToRemove) {
      return;
    }

    await handleRemoveFriend(friendToRemove.id);
    setFriendToRemove(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Friends</h1>
      </div>

      <div className={styles.searchSection}>
        <Input
          type="text"
          placeholder="Search friends..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <Button onClick={handleAddFriend} className={styles.addButton}>
          Add Friend
        </Button>
      </div>

      <div className={styles.friendsList}>
        {filteredFriends.length === 0 ? (
          <p className={styles.noFriends}>
            {searchTerm
              ? "No friends found matching your search"
              : "No friends yet. Add some friends to get started!"}
          </p>
        ) : (
          filteredFriends.map((friend) => (
            <Card key={friend.id} className={styles.friendCard}>
              <div className={styles.friendContent}>
                <Avatar className={styles.avatar}>
                  <AvatarImage
                    src={friend.image ?? undefined}
                    alt={friend.handle ?? "Friend profile picture"}
                  />
                  <AvatarFallback className={styles.avatarFallback}>
                    {getAvatarFallback(friend.handle)}
                  </AvatarFallback>
                </Avatar>
                <div className={styles.friendInfo}>
                  <h3 className={styles.friendHandle}>{friend.handle}</h3>
                  {friend.email && (
                    <p className={styles.friendEmail}>{friend.email}</p>
                  )}
                </div>
                <Button
                  variant="destructive"
                  onClick={() => handleOpenRemoveDialog(friend)}
                  disabled={removingFriendId === friend.id}
                  className={styles.removeButton}
                >
                  {removingFriendId === friend.id
                    ? "Removing..."
                    : "Remove Friend"}
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isAddFriendOpen} onOpenChange={setIsAddFriendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Friend</DialogTitle>
            <DialogDescription>
              Search for users by their handle to send a friend request.
            </DialogDescription>
          </DialogHeader>

          <div className={styles.dialogContent}>
            <Input
              type="text"
              placeholder="Search users..."
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              className={styles.userSearchInput}
            />

            <div className={styles.searchResults}>
              {isSearching && (
                <p className={styles.searchStatus}>Searching...</p>
              )}

              {!isSearching &&
                userSearchQuery.trim().length >= 2 &&
                searchResults.length === 0 && (
                  <p className={styles.searchStatus}>No users found</p>
                )}

              {!isSearching &&
                searchResults.map((user) => (
                  <Card key={user.id} className={styles.userCard}>
                    <div className={styles.userContent}>
                      <Avatar className={styles.userAvatar}>
                        <AvatarImage
                          src={user.image ?? undefined}
                          alt={user.handle}
                        />
                        <AvatarFallback className={styles.avatarFallback}>
                          {getAvatarFallback(user.handle)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={styles.userInfo}>
                        <h4 className={styles.userHandle}>{user.handle}</h4>
                      </div>
                      <Button onClick={() => handleViewFriend(user.id)}>
                        View
                      </Button>
                      <Button
                        onClick={() => handleSendFriendRequest(user.id)}
                        disabled={sendingRequestTo === user.id}
                        className={styles.sendRequestButton}
                      >
                        {sendingRequestTo === user.id
                          ? "Sending..."
                          : "Add Friend"}
                      </Button>
                    </div>
                  </Card>
                ))}

              {userSearchQuery.trim().length < 2 && (
                <p className={styles.searchStatus}>
                  Type at least 2 characters to search
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={friendToRemove !== null}
        onOpenChange={(open) => {
          if (!open) {
            setFriendToRemove(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Friend</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              {friendToRemove?.handle || "this friend"} from your friends list?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFriendToRemove(null)}
              disabled={removingFriendId !== null}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRemoveFriend}
              disabled={removingFriendId !== null}
            >
              {removingFriendId !== null ? "Removing..." : "Remove Friend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
