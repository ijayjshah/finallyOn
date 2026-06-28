import { chromium } from "playwright";
import { CARD_HEIGHT, CARD_WIDTH } from "./constants";
import {
  buildTrustCardHtml,
  REFERENCE_WIDTH,
  type TrustCardHtmlInput,
} from "./html-template";

let browserPromise: ReturnType<typeof chromium.launch> | null = null;

async function getBrowser() {
  if (!browserPromise) {
    browserPromise = chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none"],
    });
  }
  return browserPromise;
}

export async function renderTrustCardPngFromHtml(
  input: TrustCardHtmlInput,
): Promise<Buffer> {
  const html = buildTrustCardHtml(input);
  const browser = await getBrowser();

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
}

export type { TrustCardHtmlInput };

export { CARD_WIDTH, CARD_HEIGHT };
