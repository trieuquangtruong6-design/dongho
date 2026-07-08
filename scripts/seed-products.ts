import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import { prisma } from "../lib/prisma";
import type { Product } from "../src/types";

type SeedProduct = Product & {
  code?: string;
  price?: number;
  description?: string;
};

const serverPath = path.join(process.cwd(), "server.ts");

function loadProductsFromServer(): SeedProduct[] {
  const source = fs
    .readFileSync(serverPath, "utf-8")
    .replace(/^import .*;$/gm, "")
    .replace(/\nstartServer\(\);\s*$/m, "");

  const instrumentedSource = `
${source}
globalThis.__SEED_PRODUCTS__ = ALL_PRODUCTS;
`;

  const { outputText } = ts.transpileModule(instrumentedSource, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  });

  const sandbox: Record<string, unknown> = {
    console,
    fs,
    path,
    process,
    globalThis: {},
    Set,
    Array,
    String,
    Number,
    Math,
    Date,
  };

  vm.createContext(sandbox);
  vm.runInContext(outputText, sandbox, { filename: "server.seed.vm.js" });

  const products = (sandbox.globalThis as { __SEED_PRODUCTS__?: SeedProduct[] }).__SEED_PRODUCTS__;
  if (!Array.isArray(products)) {
    throw new Error("Could not extract ALL_PRODUCTS from server.ts");
  }

  return products;
}

function normalizeProduct(product: SeedProduct): Product {
  if (!product.id || !product.code || !product.name) {
    throw new Error(`Invalid product seed: missing id, code, or name (${JSON.stringify(product)})`);
  }

  if (!product.category || !product.brand || !product.origin) {
    throw new Error(`Invalid product seed ${product.id}: missing category, brand, or origin`);
  }

  if (typeof product.price !== "number" || Number.isNaN(product.price)) {
    throw new Error(`Invalid product seed ${product.id}: price must be a number`);
  }

  return {
    id: String(product.id),
    code: String(product.code),
    name: String(product.name),
    category: String(product.category),
    brand: String(product.brand),
    origin: String(product.origin),
    target: product.target ? String(product.target) : undefined,
    price: Math.round(product.price),
    discountPrice:
      typeof product.discountPrice === "number" ? Math.round(product.discountPrice) : null,
    image: product.image ? String(product.image) : "",
    isFeatured: Boolean(product.isFeatured),
    isNew: Boolean(product.isNew),
    isLimited: Boolean(product.isLimited),
    size: product.size ? String(product.size) : undefined,
    glassMaterial:
      typeof product.glassMaterial === "boolean" ? product.glassMaterial : undefined,
    caseMaterial:
      typeof product.caseMaterial === "boolean" ? product.caseMaterial : undefined,
    waterResistance: product.waterResistance ? String(product.waterResistance) : undefined,
    description: product.description ? String(product.description) : "",
  };
}

function ensureUnique(products: Product[]) {
  const seenIds = new Set<string>();
  const seenCodes = new Set<string>();

  for (const product of products) {
    if (seenIds.has(product.id)) {
      throw new Error(`Duplicate product id: ${product.id}`);
    }
    if (seenCodes.has(product.code)) {
      throw new Error(`Duplicate product code: ${product.code}`);
    }

    seenIds.add(product.id);
    seenCodes.add(product.code);
  }
}

async function main() {
  const products = loadProductsFromServer().map(normalizeProduct);
  ensureUnique(products);

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      create: product,
      update: product,
    });
  }

  const count = await prisma.product.count();
  console.log(`Seeded ${products.length} products. Database now has ${count} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
