import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

const email = (process.env.ADMIN_EMAIL || "admin@dangquangwatch.vn").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || "Admin@123456";
const name = process.env.ADMIN_NAME || "Đăng Quang Admin";

async function main() {
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: "ADMIN",
      membership: "VIP"
    },
    create: {
      name,
      email,
      passwordHash,
      phone: "",
      address: "",
      avatar: "",
      membership: "VIP",
      role: "ADMIN"
    }
  });

  console.log(`Admin account is ready: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
