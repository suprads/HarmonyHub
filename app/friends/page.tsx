"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import styles from "./friends.module.css";

interface Friend {
  id: string;
  handle: string;
  email?: string | null;
}

interface UserSearchResult {
  id: string;
  handle: string;
}

export default function Page() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sendingRequestTo, setSendingRequestTo] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with actual user ID from auth
    const fetchFriends = async () => {
      try {
        const response = await fetch("/api/friends");
        if (response.ok) {
          const data = await response.json();
          setFriends(data);
          setFilteredFriends(data);
        }
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      }
    };

    fetchFriends();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = friends.filter((friend) =>
        friend.handle.toLowerCase().includes(searchTerm.toLowerCase()),
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
                  <span className={styles.avatarFallback}>
                    {friend.handle.substring(0, 2).toUpperCase()}
                  </span>
                </Avatar>
                <div className={styles.friendInfo}>
                  <h3 className={styles.friendHandle}>{friend.handle}</h3>
                  {friend.email && (
                    <p className={styles.friendEmail}>{friend.email}</p>
                  )}
                </div>
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
                        <span className={styles.avatarFallback}>
                          {user.handle.substring(0, 2).toUpperCase()}
                        </span>
                      </Avatar>
                      <div className={styles.userInfo}>
                        <h4 className={styles.userHandle}>{user.handle}</h4>
                      </div>
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
    </div>
  );
}
