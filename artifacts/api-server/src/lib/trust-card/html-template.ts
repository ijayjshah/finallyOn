import { FEATURE_ICONS, FINALLYON_ICON_SVG, verifiedSealSvg, BLUE } from "./brand-assets";

export type TrustCardHtmlInput = {
  businessName: string;
  profileTypeLabel: string;
  district: string;
  avatarSrc: string;
  avatarIsPhoto: boolean;
  logoDataUri: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Reference layout width — scaled to fit CARD_WIDTH × CARD_HEIGHT at render time */
export const REFERENCE_WIDTH = 560;

export function buildTrustCardHtml(input: TrustCardHtmlInput): string {
  const name = escapeHtml(input.businessName);
  const category = escapeHtml(`${input.profileTypeLabel} • ${input.district}`);
  const district = escapeHtml(input.district);

  const avatarInner = input.avatarIsPhoto
    ? `<img src="${input.avatarSrc}" alt="" class="avatarPhoto" />`
    : `<div class="avatarDefault">
        <div class="avatarIcon">${FINALLYON_ICON_SVG}</div>
        <span class="avatarBrand">FinallyOn</span>
      </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=${REFERENCE_WIDTH}, initial-scale=1" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
    html, body {
      width: ${REFERENCE_WIDTH}px;
      background: #000;
      color: #fff;
      overflow: hidden;
    }
    body {
      display: flex;
      justify-content: center;
      padding: 46px 8px 36px;
    }
    .backgroundGlow {
      position: fixed;
      width: 700px;
      height: 700px;
      background: ${BLUE.glow};
      filter: blur(220px);
      opacity: 0.22;
      border-radius: 50%;
      left: 50%;
      top: 45%;
      transform: translate(-50%, -50%);
      z-index: -5;
      pointer-events: none;
    }
    .hero {
      width: 100%;
      max-width: ${REFERENCE_WIDTH}px;
      text-align: center;
      position: relative;
      z-index: 1;
    }
    .logo {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-bottom: 14px;
    }
    .logo img {
      width: 110px;
      height: 110px;
      object-fit: contain;
    }
    .logo span { font-size: 38px; font-weight: 700; line-height: 1; }
    .top p {
      font-size: 24px;
      color: #d4d4d4;
      margin-bottom: 36px;
      line-height: 1.35;
      white-space: nowrap;
    }
    .top p span { color: ${BLUE.tagline}; font-weight: 600; }
    .profileCard {
      position: relative;
      overflow: hidden;
      border-radius: 38px;
      background: linear-gradient(180deg, #090909, #020202);
      border: 1px solid rgba(255,255,255,0.08);
      padding: 40px 30px 0;
      box-shadow:
        0 0 70px rgba(18,58,168,0.28),
        0 0 140px rgba(18,58,168,0.16),
        inset 0 0 30px rgba(255,255,255,0.02);
      text-align: center;
    }
    .profileCard::before {
      content: '';
      position: absolute;
      inset: 0;
      padding: 2px;
      border-radius: 38px;
      background: linear-gradient(135deg, ${BLUE.rim}, rgba(0,0,0,0), ${BLUE.rim});
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }
    .mapOverlay {
      position: absolute;
      right: -60px;
      top: -30px;
      width: 350px;
      height: 350px;
      opacity: 0.08;
      filter: grayscale(100%);
      pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 350 350'%3E%3Cpath d='M40 80c40-20 80-10 120 20s80 30 120 10 80-40 120-20' stroke='%23888' fill='none' stroke-width='1.2'/%3E%3Cpath d='M20 180c50 10 90-10 130 20s90 20 130 0 90-30 120-10' stroke='%23888' fill='none' stroke-width='1.2'/%3E%3Cpath d='M60 250c30 15 70 5 110 25s70 15 110-5' stroke='%23888' fill='none' stroke-width='1.2'/%3E%3C/svg%3E");
      background-size: cover;
    }
    .contourOverlay {
      position: absolute;
      left: -40px;
      top: -20px;
      width: 280px;
      height: 280px;
      opacity: 0.07;
      pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 280 280'%3E%3Ccircle cx='140' cy='140' r='60' stroke='%23666' fill='none'/%3E%3Ccircle cx='140' cy='140' r='90' stroke='%23666' fill='none'/%3E%3Ccircle cx='140' cy='140' r='120' stroke='%23666' fill='none'/%3E%3Ccircle cx='140' cy='140' r='150' stroke='%23666' fill='none'/%3E%3Ccircle cx='140' cy='140' r='180' stroke='%23666' fill='none'/%3E%3Ccircle cx='140' cy='140' r='210' stroke='%23666' fill='none'/%3E%3C/svg%3E");
      background-size: contain;
      background-repeat: no-repeat;
    }
    .avatarWrap {
      position: relative;
      width: 210px;
      margin: auto;
    }
    .avatar {
      width: 210px;
      height: 210px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #000;
      border: 5px solid ${BLUE.avatarBorder};
      box-shadow: 0 0 60px ${BLUE.avatarGlow};
      overflow: hidden;
    }
    .avatarDefault {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .avatarIcon {
      width: 120px;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .avatarIcon svg { width: 100%; height: 100%; display: block; }
    .avatarBrand {
      font-size: 11px;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.2px;
      line-height: 1;
    }
    .avatarPhoto { width: 100%; height: 100%; object-fit: cover; }
    .verify {
      position: absolute;
      bottom: 6px;
      right: 2px;
      width: 48px;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 3;
      filter: drop-shadow(0 3px 10px rgba(18, 58, 168, 0.65));
    }
    .verify svg { width: 48px; height: 48px; display: block; }
    .profile h2 {
      font-size: 42px;
      margin-top: 25px;
      font-weight: 700;
      line-height: 1.1;
    }
    .category {
      margin-top: 10px;
      color: ${BLUE.category};
      font-size: 22px;
      font-weight: 400;
    }
    .features {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      justify-items: stretch;
      margin-top: 45px;
      border-top: 1px solid rgba(255,255,255,0.06);
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .item {
      padding: 26px 2px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      text-align: center;
      min-width: 0;
    }
    .featureIcon {
      display: block;
      width: 100%;
      height: 36px;
      margin-bottom: 14px;
      text-align: center;
      line-height: 0;
    }
    .featureIcon svg {
      display: inline-block;
      vertical-align: top;
    }
    .item .label {
      display: block;
      width: 100%;
      font-size: 15px;
      color: #fff;
      text-align: center;
      white-space: nowrap;
      line-height: 1.2;
    }
    .quote {
      margin-top: 36px;
      margin-bottom: 38px;
      padding: 32px 28px;
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.06);
      background: #070707;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: center;
      gap: 16px;
    }
    .quoteMark {
      flex-shrink: 0;
      display: flex;
      align-items: flex-start;
      padding-top: 8px;
    }
    .quoteBody {
      text-align: center;
    }
    .quote p {
      font-size: 28px;
      line-height: 42px;
      color: #efefef;
      text-align: center;
      font-style: italic;
    }
    .quote span { color: ${BLUE.quote}; font-weight: 600; }
    .bottom {
      margin: 0 -30px;
      padding: 28px;
      background: linear-gradient(90deg, ${BLUE.footerStart}, ${BLUE.footerEnd});
    }
    .bottom p {
      letter-spacing: 4px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.45);
    }
    .bottom h3 {
      margin-top: 15px;
      font-size: 28px;
      font-weight: 700;
      color: #fff;
      line-height: 1.15;
      white-space: nowrap;
    }
    .bottom h3 .everyone {
      color: #000;
      font-weight: 800;
    }
    .website { margin-top: 45px; }
    .website small {
      display: block;
      margin-bottom: 14px;
      color: #999;
      font-size: 16px;
    }
    .link {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 14px 26px;
      border-radius: 40px;
      border: 1px solid ${BLUE.linkBorder};
      background: #080808;
      font-size: 20px;
      color: #fff;
    }
    .link i, .linkIcon { display: flex; align-items: center; }
  </style>
</head>
<body>
  <div class="backgroundGlow"></div>
  <section class="hero">
    <div class="top">
      <div class="logo">
        <img src="${input.logoDataUri}" alt="FinallyOn" />
        <span>FinallyOn</span>
      </div>
      <p>Your District. Your People. <span>Your Platform.</span></p>
    </div>

    <div class="profileCard">
      <div class="contourOverlay"></div>
      <div class="mapOverlay"></div>

      <div class="profile">
        <div class="avatarWrap">
          <div class="avatar">
            ${avatarInner}
          </div>
          <div class="verify">${verifiedSealSvg(48)}</div>
        </div>
        <h2>${name}</h2>
        <p class="category">${category}</p>
      </div>

      <div class="features">
        <div class="item"><div class="featureIcon">${FEATURE_ICONS.trusted}</div><span class="label">Trusted</span></div>
        <div class="item"><div class="featureIcon">${FEATURE_ICONS.local}</div><span class="label">Local</span></div>
        <div class="item"><div class="featureIcon">${FEATURE_ICONS.verified}</div><span class="label">Verified</span></div>
        <div class="item"><div class="featureIcon">${FEATURE_ICONS.support}</div><span class="label">Quick Support</span></div>
      </div>

      <div class="quote">
        <span class="quoteMark">${FEATURE_ICONS.quote}</span>
        <div class="quoteBody">
          <p>
            Delivering Quality Services.<br />
            Building Trust in <span>${district}.</span>
          </p>
        </div>
      </div>

      <div class="bottom">
        <p>DISCOVER • CONNECT • GROW</p>
        <h3>Built for ${district}. Built for <span class="everyone">Everyone.</span></h3>
      </div>
    </div>

    <div class="website">
      <small>Find us on</small>
      <div class="link">
        <span class="linkIcon">${FEATURE_ICONS.globe}</span>
        finallyon.in
      </div>
    </div>
  </section>
</body>
</html>`;
}
