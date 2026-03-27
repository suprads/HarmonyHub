import { searchForUser } from "@/services/db/user";
import { prismaMock } from "@/jest.setup";

test(`finds user bob from search "bo"`, async () => {
  const stubDate = new Date();
  const users = [
    {
      id: "1",
      handle: "Bob",
      name: "Bob",
      email: "bob@example.com",
      emailVerified: false,
      createdAt: stubDate,
      updatedAt: stubDate,
      image: null,
    },
  ];

  prismaMock.user.findMany.mockResolvedValue(users);

  await expect(searchForUser("Bo")).resolves.toEqual([
    {
      id: "1",
      handle: "Bob",
      name: "Bob",
      email: "bob@example.com",
      emailVerified: false,
      createdAt: stubDate,
      updatedAt: stubDate,
      image: null,
    },
  ]);
});
