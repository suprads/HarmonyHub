import { prismaMock } from "@/jest.setup";
import { genNotificationMsg } from "@/services/db/notification";

const friendRequest = { createdAt: new Date(), receiverId: "1", senderId: "2" };
const user = {
  id: friendRequest.senderId,
  handle: "Bob",
  name: "",
  email: "",
  emailVerified: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  image: null,
};

it("generates a notification message", async () => {
  prismaMock.friendRequest.findUnique.mockResolvedValue(friendRequest);
  prismaMock.user.findUnique.mockResolvedValue(user);

  await expect(genNotificationMsg("FRIEND_REQUEST", `2_1`)).resolves.toEqual(
    `You received a friend request from ${user?.handle}`,
  );
});

it("doesn't generate a message because improper id given", async () => {
  prismaMock.friendRequest.findUnique.mockResolvedValue(null);

  await expect(
    genNotificationMsg("FRIEND_REQUEST", "1"),
  ).resolves.toBeUndefined();
});
