import "dotenv/config";
import { prisma } from "../lib/prisma";

const expectedTables = ["User", "Product", "Order", "OrderItem", "Wishlist"];

async function main() {
  const rows = await prisma.$queryRaw<{ table_name: string }[]>`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name in ('User', 'Product', 'Order', 'OrderItem', 'Wishlist')
    order by table_name
  `;

  const found = new Set(rows.map((row) => row.table_name));
  const missing = expectedTables.filter((table) => !found.has(table));

  if (missing.length > 0) {
    throw new Error(`Missing tables: ${missing.join(", ")}`);
  }

  console.log(`Database schema OK: ${rows.map((row) => row.table_name).join(", ")}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
