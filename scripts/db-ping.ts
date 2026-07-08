import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const result = await prisma.$queryRaw<{ ok: number }[]>`select 1 as ok`;
  console.log(result[0]?.ok === 1 ? "Database connection OK" : "Database connection failed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
