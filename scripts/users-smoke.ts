import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

const baseUrl = process.env.SMOKE_BASE_URL || "http://localhost:3000";
const stamp = Date.now();
const adminEmail = `codex-users-admin-${stamp}@example.com`;
const customerEmail = `codex-users-customer-${stamp}@example.com`;
const adminPassword = "CodexUsersAdmin123!";

async function request(path: string, init?: RequestInit) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${init?.method || "GET"} ${path} failed: ${response.status} ${JSON.stringify(data)}`);
  }
  return data;
}

async function main() {
  let customerId = "";

  try {
    await prisma.user.create({
      data: {
        name: "Codex Users Admin",
        email: adminEmail,
        passwordHash: await bcrypt.hash(adminPassword, 12),
        phone: "",
        address: "",
        avatar: "",
        membership: "VIP",
        role: "ADMIN"
      }
    });

    const customer = await prisma.user.create({
      data: {
        name: "Codex Users Customer",
        email: customerEmail,
        passwordHash: await bcrypt.hash("temporary", 12),
        phone: "0900000002",
        address: "Smoke address",
        avatar: "",
        membership: "MEMBER",
        role: "CUSTOMER"
      }
    });
    customerId = customer.id;

    const login = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: adminEmail, password: adminPassword })
    });
    const headers = { Authorization: `Bearer ${login.token}` };

    const users = await request("/api/users", { headers });
    if (!users.some((user: any) => user.id === customerId)) {
      throw new Error("Users list does not include smoke customer");
    }

    const updated = await request(`/api/users/${encodeURIComponent(customerId)}/admin`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        name: "Codex Users Customer Updated",
        email: customerEmail,
        phone: "0900000003",
        address: "Updated smoke address",
        avatar: "",
        membership: "VIP",
        role: "CUSTOMER"
      })
    });
    if (updated.user?.membership !== "VIP" || updated.user?.phone !== "0900000003") {
      throw new Error("Update user response is invalid");
    }

    await request(`/api/users/${encodeURIComponent(customerId)}`, {
      method: "DELETE",
      headers
    });

    console.log(`Users admin smoke OK for ${customerEmail}`);
  } finally {
    if (customerId) {
      await prisma.user.deleteMany({ where: { id: customerId } });
    }
    await prisma.user.deleteMany({ where: { email: adminEmail } });
    await prisma.user.deleteMany({ where: { email: customerEmail } });
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
