import { CARD_HEIGHT, CARD_WIDTH } from "./constants";
import {
  buildTrustCardHtml,
  REFERENCE_WIDTH,
  type TrustCardHtmlInput,
} from "./html-template";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function applyFitScale(
  page: {
    addStyleTag(options: { content: string }): Promise<unknown>;
    $: (selector: string) => Promise<{ boundingBox(): Promise<{ height: number } | null> } | null>;
  },
) {
  const hero = await page.$(".hero");
  const heroBox = await hero?.boundingBox();
  const heroHeight = heroBox ? Math.ceil(heroBox.height) : 1200;

  const padY = 100;
  const fitScale = Math.min(
    (CARD_WIDTH - 40) / REFERENCE_WIDTH,
    (CARD_HEIGHT - padY) / heroHeight,
  );

  await page.addStyleTag({
    content: `
      html, body {
        width: ${CARD_WIDTH}px !important;
        height: ${CARD_HEIGHT}px !important;
        overflow: hidden !important;
        padding: 0 !important;
      }
      body {
        display: flex !important;
        justify-content: center !important;
        align-items: flex-start !important;
        padding-top: 50px !important;
      }
      .backgroundGlow {
        transform: translate(-50%, -50%) scale(${fitScale}) !important;
      }
      .hero {
        transform: scale(${fitScale}) !important;
        transform-origin: top center !important;
      }
    `,
  });
}

/** Production (Linux / Render): Chromium binary bundled in npm — no build-time install. */
async function renderWithPackagedChromium(html: string): Promise<Buffer> {
  const puppeteer = await import("puppeteer-core");
  const chromium = await import("@sparticuz/chromium");

  const browser = await puppeteer.default.launch({
    args: [
      ...chromium.default.args,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--font-render-hinting=none",
    ],
    executablePath: await chromium.default.executablePath(),
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: CARD_WIDTH, height: CARD_HEIGHT, deviceScaleFactor: 1 });
    try {
      await page.setContent(html, { waitUntil: "load" });
      await sleep(1500);
      await applyFitScale(page);
      await sleep(100);

      const png = await page.screenshot({
        type: "png",
        clip: { x: 0, y: 0, width: CARD_WIDTH, height: CARD_HEIGHT },
      });

      if (png.length === 0) {
        throw new Error("Empty PNG from HTML renderer");
      }

      return Buffer.from(png);
    } finally {
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

/** Local dev (macOS / Windows): Playwright + locally cached browser. */
async function renderWithPlaywright(html: string): Promise<Buffer> {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none"],
  });

  try {
    const context = await browser.newContext({
      viewport: { width: CARD_WIDTH, height: CARD_HEIGHT },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    try {
      await page.setContent(html, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);

      const heroBox = await page.locator(".hero").boundingBox();
      const heroHeight = heroBox ? Math.ceil(heroBox.height) : 1200;

      const padY = 100;
      const fitScale = Math.min(
        (CARD_WIDTH - 40) / REFERENCE_WIDTH,
        (CARD_HEIGHT - padY) / heroHeight,
      );

      await page.addStyleTag({
        content: `
          html, body {
            width: ${CARD_WIDTH}px !important;
            height: ${CARD_HEIGHT}px !important;
            overflow: hidden !important;
            padding: 0 !important;
          }
          body {
            display: flex !important;
            justify-content: center !important;
            align-items: flex-start !important;
            padding-top: 50px !important;
          }
          .backgroundGlow {
            transform: translate(-50%, -50%) scale(${fitScale}) !important;
          }
          .hero {
            transform: scale(${fitScale}) !important;
            transform-origin: top center !important;
          }
        `,
      });

      await page.waitForTimeout(100);

      const png = await page.screenshot({
        type: "png",
        clip: { x: 0, y: 0, width: CARD_WIDTH, height: CARD_HEIGHT },
      });

      if (png.length === 0) {
        throw new Error("Empty PNG from HTML renderer");
      }

      return Buffer.from(png);
    } finally {
      await context.close();
    }
  } finally {
    await browser.close();
  }
}

export async function renderTrustCardPngFromHtml(
  input: TrustCardHtmlInput,
): Promise<Buffer> {
  const html = buildTrustCardHtml(input);

  if (process.platform === "linux") {
    return renderWithPackagedChromium(html);
  }

  return renderWithPlaywright(html);
}

export type { TrustCardHtmlInput };

export { CARD_WIDTH, CARD_HEIGHT };
