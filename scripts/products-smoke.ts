import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

const baseUrl = process.env.SMOKE_BASE_URL || "http://localhost:3000";
const stamp = Date.now();
const email = `codex-product-${stamp}@example.com`;
const password = "CodexProductTest123!";
const productId = `codex-product-${stamp}`;

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
    await prisma.user.create({
      data: {
        name: "Codex Product Admin",
        email,
        passwordHash: await bcrypt.hash(password, 12),
        phone: "",
        address: "",
        avatar: "",
        membership: "VIP",
        role: "ADMIN"
      }
    });

    const login = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    const headers = {
      Authorization: `Bearer ${login.token}`
    };

    const product = {
      id: productId,
      code: `CDX-${stamp}`,
      name: "Codex Product Smoke",
      category: "dong-ho",
      brand: "Codex Brand",
      origin: "Thuy Sy",
      target: "Nam",
      price: 1230000,
      discountPrice: 990000,
      image: "/images/1 (1).jpg",
      isFeatured: false,
      isNew: true,
      isLimited: false,
      size: "40 mm",
      glassMaterial: true,
      caseMaterial: true,
      waterResistance: "5 ATM",
      description: "Smoke test product"
    };

    const created = await request("/api/products", {
      method: "POST",
      headers,
      body: JSON.stringify(product)
    });
    if (created.product?.id !== productId) {
      throw new Error("Create product response is invalid");
    }

    const updated = await request(`/api/products/${encodeURIComponent(productId)}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        ...product,
        name: "Codex Product Smoke Updated",
        price: 1500000
      })
    });
    if (updated.product?.name !== "Codex Product Smoke Updated") {
      throw new Error("Update product response is invalid");
    }

    await request(`/api/products/${encodeURIComponent(productId)}`, {
      method: "DELETE",
      headers
    });

    console.log(`Product CRUD smoke OK for ${productId}`);
  } finally {
    await prisma.product.deleteMany({ where: { id: productId } });
    await prisma.user.deleteMany({ where: { email } });
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
