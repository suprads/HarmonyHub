import { searchForUser } from "@/services/db/user";
import { prismaMock } from "@/jest.setup";

test(`finds user bob from search "bo"`, async () => {
  const createdAt = new Date();
  const users = [
    {
      id: "1",
      handle: "Bob",
      email: "bob@example.com",
      createdAt: createdAt,
    },
  ];

  prismaMock.user.findMany.mockResolvedValue(users);

  await expect(searchForUser("Bo")).resolves.toEqual([
    {
      id: "1",
      handle: "Bob",
      email: "bob@example.com",
      createdAt: createdAt,
    },
  ]);
});
