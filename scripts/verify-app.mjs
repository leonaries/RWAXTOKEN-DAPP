import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const port = Number(process.env.VERIFY_PORT || 3000);
const baseUrl = process.env.VERIFY_BASE_URL || `http://127.0.0.1:${port}`;
const screenshotDir = ".verification/screenshots";
const forbiddenPatterns = [
  /Runtime TypeError/i,
  /__webpack_modules__\[moduleId\] is not a function/i,
  /segment-explorer-node\.js/i,
  /Hydration failed/i,
  /Console Error/i,
  /Unhandled Runtime Error/i,
  /切换注册/i,
  /选择邮箱验证码、Google 授权或 Web3 钱包登录/i,
  /首次登录即自动创建账号/i,
  /验证码收不到/i
];

const routes = [
  {
    path: "/",
    name: "home",
    selector: "text=RWAXTOKEN",
    expectedText: "RWA Token 打新专区",
    expectedBackground: "rgb(245, 247, 245)",
    minHeroFontSize: 72
  },
  {
    path: "/login",
    name: "login",
    selector: "text=账号登录",
    expectedText: "邮箱登录",
    expectedBackground: "rgb(252, 252, 253)",
    minHeroFontSize: 28
  }
];

function waitForServer(url, timeoutMs = 30000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          resolve();
          return;
        }
      } catch {
        // Keep polling until timeout.
      }

      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error(`Timed out waiting for ${url}`));
        return;
      }

      setTimeout(check, 500);
    };

    check();
  });
}

function assertNoForbiddenText(label, text) {
  const match = forbiddenPatterns.find((pattern) => pattern.test(text));
  if (match) {
    throw new Error(`${label} contains forbidden runtime text: ${match}`);
  }
}

async function launchBrowser() {
  try {
    return await chromium.launch({ channel: "chrome" });
  } catch {
    return chromium.launch();
  }
}

async function verifyRoute(page, route) {
  const consoleMessages = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      consoleMessages.push(`${message.type()}: ${message.text()}`);
    }
  });

  const response = await page.goto(`${baseUrl}${route.path}`, {
    waitUntil: "networkidle"
  });

  if (!response?.ok()) {
    throw new Error(`${route.path} returned HTTP ${response?.status()}`);
  }

  await page.locator(route.selector).first().waitFor({ state: "visible" });

  const result = await page.evaluate((routeConfig) => {
    const bodyText = document.body.innerText;
    const toastText = Array.from(document.querySelectorAll(".nextjs-toast"))
      .map((node) => node.textContent || "")
      .join("\n");
    const errorOverlay = document.querySelector("[data-nextjs-error-overlay]");
    const root = Array.from(document.querySelectorAll("main")).find((node) =>
      (node.textContent || "").includes(routeConfig.expectedText)
    );
    const hero = Array.from(document.querySelectorAll("h1, h2")).find((node) =>
      (node.textContent || "").includes(routeConfig.name === "home" ? "RWAXTOKEN" : "账号登录")
    );

    return {
      bodyText,
      toastText,
      hasErrorOverlay: Boolean(errorOverlay),
      mainBackground: root ? getComputedStyle(root).backgroundColor : "",
      heroFontSize: hero ? Number.parseFloat(getComputedStyle(hero).fontSize) : 0
    };
  }, route);

  assertNoForbiddenText(`${route.path} body`, result.bodyText);
  assertNoForbiddenText(`${route.path} Next toast`, result.toastText);
  assertNoForbiddenText(`${route.path} console`, consoleMessages.join("\n"));

  if (result.hasErrorOverlay) {
    throw new Error(`${route.path} rendered a Next.js error overlay`);
  }

  if (result.mainBackground !== route.expectedBackground) {
    throw new Error(
      `${route.path} expected styled background ${route.expectedBackground}, got ${result.mainBackground}`
    );
  }

  if (result.heroFontSize < route.minHeroFontSize) {
    throw new Error(
      `${route.path} expected styled hero font >= ${route.minHeroFontSize}px, got ${result.heroFontSize}px`
    );
  }

  await page.screenshot({
    path: `${screenshotDir}/${route.name}.png`,
    fullPage: true
  });
}

async function main() {
  await mkdir(screenshotDir, { recursive: true });

  const shouldStartServer = process.env.VERIFY_START_SERVER === "1";
  const server = shouldStartServer
    ? spawn(
        process.execPath,
        ["node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", String(port)],
        {
          env: { ...process.env, PORT: String(port) },
          stdio: ["ignore", "pipe", "pipe"]
        }
      )
    : null;

  const serverOutput = [];
  server?.stdout.on("data", (chunk) => serverOutput.push(chunk.toString()));
  server?.stderr.on("data", (chunk) => serverOutput.push(chunk.toString()));

  try {
    await waitForServer(baseUrl);
    const browser = await launchBrowser();
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });

    for (const route of routes) {
      const page = await context.newPage();
      await verifyRoute(page, route);
      await page.close();
    }

    await browser.close();

    const logs = serverOutput.join("\n");
    assertNoForbiddenText("dev server logs", logs);

    console.log(`Verified ${routes.length} routes at ${baseUrl}`);
    console.log(`Screenshots saved to ${screenshotDir}`);
  } catch (error) {
    console.error(serverOutput.join("\n"));
    throw error;
  } finally {
    server?.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
