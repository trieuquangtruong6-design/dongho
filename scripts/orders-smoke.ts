import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

const baseUrl = process.env.SMOKE_BASE_URL || "http://localhost:3000";
const email = `codex-order-${Date.now()}@example.com`;
const adminEmail = `codex-admin-${Date.now()}@example.com`;
const password = "CodexOrderTest123!";
const adminPassword = "CodexAdminTest123!";
let createdOrderId = "";

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
    const unauthorizedOrders = await fetch(`${baseUrl}/api/orders`);
    if (unauthorizedOrders.status !== 401) {
      throw new Error(`Orders API should require admin token, got ${unauthorizedOrders.status}`);
    }

    const registered = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Codex Order Smoke",
        email,
        password
      })
    });

    await prisma.user.create({
      data: {
        name: "Codex Admin Smoke",
        email: adminEmail,
        passwordHash: "temporary",
        phone: "",
        address: "",
        avatar: "",
        membership: "VIP",
        role: "ADMIN"
      }
    });

    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        passwordHash: await bcrypt.hash(adminPassword, 12)
      }
    });

    const adminLogin = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: adminEmail, password: adminPassword })
    });

    const adminHeaders = {
      Authorization: `Bearer ${adminLogin.token}`
    };

    const products = await request("/api/products");
    const product = products[0];
    if (!product?.id) {
      throw new Error("Products API did not return a usable product");
    }

    const unitPrice = product.discountPrice || product.price;
    const orderResponse = await request("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        userEmail: email,
        customerName: "Codex Order Smoke",
        customerPhone: "0900000001",
        customerAddress: "Smoke test address",
        items: [{ product, quantity: 1 }],
        totalOriginal: unitPrice,
        totalDiscounted: unitPrice,
        discountRate: 0,
        note: "smoke test"
      })
    });

    const order = orderResponse.order;
    createdOrderId = order?.id || "";
    if (!createdOrderId || !order?.warrantyCode || order.items?.[0]?.product?.id !== product.id) {
      throw new Error("Order response is invalid");
    }

    const warranty = await request(`/api/warranty/${encodeURIComponent(order.warrantyCode)}`);
    if (warranty.order?.id !== createdOrderId) {
      throw new Error("Warranty lookup did not return the created order");
    }

    const updated = await request(`/api/orders/${createdOrderId}`, {
      method: "PUT",
      headers: adminHeaders,
      body: JSON.stringify({ status: "DA_DUYET_SMOKE" })
    });
    if (updated.order?.status !== "DA_DUYET_SMOKE") {
      throw new Error("Order status update failed");
    }

    const fetchedUser = await request(`/api/users/${registered.user.id}`, {
      headers: {
        Authorization: `Bearer ${registered.token}`
      }
    });
    if (!Array.isArray(fetchedUser.user?.history) || fetchedUser.user.history.length < 1) {
      throw new Error("User history did not include the created order");
    }

    const orders = await request("/api/orders", {
      headers: adminHeaders
    });
    if (!orders.some((item: any) => item.id === createdOrderId)) {
      throw new Error("Orders list did not include the created order");
    }

    console.log(`Orders smoke OK for ${createdOrderId}`);
  } finally {
    if (createdOrderId) {
      await prisma.order.deleteMany({ where: { id: createdOrderId } });
    }
    await prisma.user.deleteMany({ where: { email } });
    await prisma.user.deleteMany({ where: { email: adminEmail } });
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
