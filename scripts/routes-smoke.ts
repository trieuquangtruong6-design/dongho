const baseUrl = process.env.SMOKE_BASE_URL || "http://localhost:3000";

const routes = [
  "/",
  "/shop",
  "/category/dong-ho",
  "/product/home-epos-1",
  "/cart",
  "/checkout",
  "/wishlist",
  "/account",
  "/about",
  "/contact",
  "/warranty",
  "/login",
  "/register",
  "/admin",
  "/not-found-smoke"
];

async function main() {
  const results = [];

  for (const route of routes) {
    const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
    const text = await response.text();
    results.push({
      route,
      status: response.status,
      hasRoot: text.includes('id="root"'),
      hasHtml: text.includes("<html")
    });
  }

  const failed = results.filter((item) => item.status >= 500 || !item.hasRoot);
  console.log(JSON.stringify(results, null, 2));

  if (failed.length > 0) {
    throw new Error(`Frontend route smoke failed: ${failed.map((item) => item.route).join(", ")}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
