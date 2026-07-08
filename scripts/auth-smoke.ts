import "dotenv/config";
import { prisma } from "../lib/prisma";

const baseUrl = process.env.SMOKE_BASE_URL || "http://localhost:3000";
const email = `codex-auth-${Date.now()}@example.com`;
const password = "CodexAuthTest123!";

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
  try {
    const registered = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Codex Auth Smoke",
        email,
        password
      })
    });

    if (!registered.user?.id || !registered.token) {
      throw new Error("Register response is missing user or token");
    }

    const loggedIn = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    if (loggedIn.user?.email !== email || !loggedIn.token) {
      throw new Error("Login response is invalid");
    }

    const unauthorizedUserFetch = await fetch(`${baseUrl}/api/users/${registered.user.id}`);
    if (unauthorizedUserFetch.status !== 401) {
      throw new Error(`Users API should require a token, got ${unauthorizedUserFetch.status}`);
    }

    const authHeaders = {
      Authorization: `Bearer ${registered.token}`
    };

    const updated = await request(`/api/users/${registered.user.id}`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({
        name: "Codex Auth Smoke Updated",
        email,
        phone: "0900000000",
        address: "Smoke test address",
        avatar: ""
      })
    });

    if (updated.user?.phone !== "0900000000") {
      throw new Error("Update response did not include updated phone");
    }

    const fetched = await request(`/api/users/${registered.user.id}`, {
      headers: authHeaders
    });
    if (fetched.user?.email !== email) {
      throw new Error("Fetch user response is invalid");
    }

    console.log(`Auth smoke OK for ${email}`);
  } finally {
    await prisma.user.deleteMany({ where: { email } });
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
