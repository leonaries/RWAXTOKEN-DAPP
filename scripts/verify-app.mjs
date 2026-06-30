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
    selector: "text=平台首页",
    expectedText: "热门活动",
    expectedBackground: "rgb(7, 9, 13)",
    heroText: "平台首页",
    minHeroFontSize: 24
  },
  {
    path: "/market",
    name: "market",
    selector: "text=全部商品",
    expectedText: "热门品牌",
    expectedBackground: "rgb(7, 9, 13)",
    heroText: "全部商品",
    minHeroFontSize: 28
  },
  {
    path: "/rwa-list",
    name: "rwa-list",
    selector: "text=RWA LIST",
    expectedText: "RWA Token 打新专区",
    expectedBackground: "rgb(7, 9, 13)",
    heroText: "RWA LIST",
    minHeroFontSize: 28
  },
  {
    path: "/rwa-list/launchpad",
    name: "launchpad",
    selector: "text=TOKEN 打新",
    expectedText: "RWA Token 打新 001 期",
    expectedBackground: "rgb(7, 9, 13)",
    heroText: "TOKEN 打新",
    minHeroFontSize: 28
  },
  {
    path: "/rwa-list/finance",
    name: "finance",
    selector: "text=Token 金融",
    expectedText: "HNB 180天 Token权益认筹",
    expectedBackground: "rgb(7, 9, 13)",
    heroText: "Token 金融",
    minHeroFontSize: 28
  },
  {
    path: "/rwa-list/staking",
    name: "staking",
    selector: "text=Staking",
    expectedText: "HNB Staking 专区",
    expectedBackground: "rgb(7, 9, 13)",
    heroText: "Staking",
    minHeroFontSize: 28
  },
  {
    path: "/rwa-list/brand-token",
    name: "brand-token",
    selector: "text=品牌Token专区",
    expectedText: "品牌Token名称",
    expectedBackground: "rgb(7, 9, 13)",
    heroText: "品牌Token专区",
    minHeroFontSize: 28
  },
  {
    path: "/hnb-pool",
    name: "hnb-pool",
    selector: "text=HNB矿池",
    expectedText: "矿池品类",
    expectedBackground: "rgb(7, 9, 13)",
    heroText: "HNB矿池",
    minHeroFontSize: 28
  },
  {
    path: "/hnb-pool/my-pool",
    name: "my-pool",
    selector: "text=我的矿池",
    expectedText: "正在挖矿",
    expectedBackground: "rgb(7, 9, 13)",
    heroText: "我的矿池",
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
      (node.textContent || "").includes(routeConfig.heroText)
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
