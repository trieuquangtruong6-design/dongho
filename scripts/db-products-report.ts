import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const [total, categories, featured] = await Promise.all([
    prisma.product.count(),
    prisma.product.groupBy({
      by: ["category"],
      _count: { _all: true },
      orderBy: { category: "asc" },
    }),
    prisma.product.count({ where: { isFeatured: true } }),
  ]);

  console.log(`Products total: ${total}`);
  console.log(`Featured products: ${featured}`);
  for (const category of categories) {
    console.log(`${category.category}: ${category._count._all}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
