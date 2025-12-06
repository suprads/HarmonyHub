import { prisma } from "./lib/prisma";

async function main() {
  // Fetch all users with their posts
  const allUsers = await prisma.user.findMany();
  console.log("All users:", JSON.stringify(allUsers, null, 2));

  console.log(process.env.DATABASE_URL);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
