import QRCode from "qrcode";

interface TicketImageData {
  eventTitle: string;
  venue: string;
  date: string;
  holderName: string;
  holderEmail: string;
  status: string;
  ticketType: string;
  price: number;
  qrCodeToken: string;
  teamMembers?: { name: string; email: string }[];
  ticketId: string;
}

// Espektro Bengali Culture Theme
const COLORS = {
  bg: "#FAF6F1",
  card: "#FFFFFF",
  primary: "#B7410E",
  primaryDark: "#8B3008",
  secondary: "#F4A900",
  gold: "#806600",
  text: "#1A1A1A",
  textMuted: "#5C5147",
  textLight: "#8A7E74",
  border: "#D4C5B9",
  cream: "#F5EDE4",
  success: "#2D7A3A",
};

// Scale factor for high-quality output
const S = 2;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function truncateText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let t = text;
  while (ctx.measureText(t + "…").width > maxWidth && t.length > 0) {
    t = t.slice(0, -1);
  }
  return t + "…";
}

function drawDiamondMotif(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
) {
  const size = 6 * S;
  const gap = 14 * S;
  const count = Math.floor(width / gap);
  ctx.save();
  ctx.fillStyle = COLORS.primary;
  ctx.globalAlpha = 0.12;
  for (let i = 0; i <= count; i++) {
    const mx = x + i * gap + gap / 2;
    ctx.beginPath();
    ctx.moveTo(mx, y);
    ctx.lineTo(mx + size / 2, y + size / 2);
    ctx.lineTo(mx, y + size);
    ctx.lineTo(mx - size / 2, y + size / 2);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function setFont(
  ctx: CanvasRenderingContext2D,
  weight: string,
  sizePx: number,
  family: string,
) {
  ctx.font = `${weight} ${sizePx * S}px ${family}`;
}

export async function generateTicketImage(
  data: TicketImageData,
): Promise<string> {
  // Logical dimensions (before scaling)
  const LW = 880;
  const PAD = 44;
  const INNER = LW - PAD * 2;

  const teamCount = (data.teamMembers?.length ?? 0) + 1;
  const hasTeam = teamCount > 1;
  const teamH = hasTeam ? 70 + teamCount * 34 : 0;
  const LH = 520 + teamH;

  // Actual canvas = logical * scale
  const W = LW * S;
  const H = LH * S;
  const P = PAD * S;
  const IW = INNER * S;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // ━━ Background ━━
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, W, H);

  // ━━ Card shadow ━━
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.10)";
  ctx.shadowBlur = 30 * S;
  ctx.shadowOffsetY = 4 * S;
  roundRect(ctx, 20 * S, 20 * S, W - 40 * S, H - 40 * S, 18 * S);
  ctx.fillStyle = COLORS.card;
  ctx.fill();
  ctx.restore();

  // Card border
  roundRect(ctx, 20 * S, 20 * S, W - 40 * S, H - 40 * S, 18 * S);
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 1 * S;
  ctx.stroke();

  // ━━ Terracotta header bar ━━
  const barH = 54 * S;
  ctx.save();
  roundRect(ctx, 20 * S, 20 * S, W - 40 * S, barH, 18 * S);
  ctx.clip();
  const grad = ctx.createLinearGradient(20 * S, 20 * S, W - 20 * S, 20 * S);
  grad.addColorStop(0, COLORS.primary);
  grad.addColorStop(0.5, COLORS.primaryDark);
  grad.addColorStop(1, COLORS.primary);
  ctx.fillStyle = grad;
  ctx.fillRect(20 * S, 20 * S, W - 40 * S, barH);
  ctx.restore();

  // "ESPEKTRO 2026"
  setFont(ctx, "bold", 12, "'Segoe UI', sans-serif");
  ctx.letterSpacing = `${4 * S}px`;
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.fillText("ESPEKTRO 2026", P + 8 * S, 20 * S + barH * 0.62);
  ctx.letterSpacing = "0px";

  // "KGEC ANNUAL FEST"
  setFont(ctx, "600", 10, "'Segoe UI', sans-serif");
  ctx.letterSpacing = `${2 * S}px`;
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  const kgec = "KGEC ANNUAL FEST";
  ctx.fillText(
    kgec,
    W - P - ctx.measureText(kgec).width - 8 * S,
    20 * S + barH * 0.62,
  );
  ctx.letterSpacing = "0px";

  // ━━ Diamond motif ━━
  drawDiamondMotif(ctx, P, (20 + 54 + 8) * S, IW);

  // ━━ Event Title ━━
  let y = (20 + 54 + 28) * S;

  setFont(ctx, "bold", 28, "'Georgia', 'Playfair Display', serif");
  ctx.fillStyle = COLORS.text;
  const titleMaxW = IW - 120 * S; // leave room for status badge
  ctx.fillText(truncateText(ctx, data.eventTitle, titleMaxW), P, y);

  // Status badge
  const statusText = data.status.toUpperCase();
  setFont(ctx, "bold", 10, "'Segoe UI', sans-serif");
  ctx.letterSpacing = `${1 * S}px`;
  const sW = ctx.measureText(statusText).width + 22 * S;
  const sX = W - P - sW;
  const sY = y - 16 * S;
  const sColor =
    data.status === "checked-in"
      ? COLORS.success
      : data.status === "booked"
        ? COLORS.primary
        : "#DC2626";
  roundRect(ctx, sX, sY, sW, 22 * S, 11 * S);
  ctx.fillStyle = sColor;
  ctx.globalAlpha = 0.1;
  ctx.fill();
  ctx.globalAlpha = 1;
  roundRect(ctx, sX, sY, sW, 22 * S, 11 * S);
  ctx.strokeStyle = sColor;
  ctx.lineWidth = 1.2 * S;
  ctx.stroke();
  ctx.fillStyle = sColor;
  ctx.fillText(statusText, sX + 11 * S, sY + 15 * S);
  ctx.letterSpacing = "0px";

  // ━━ Venue ━━
  y += 28 * S;
  setFont(ctx, "500", 13, "'Segoe UI', sans-serif");
  ctx.fillStyle = COLORS.textMuted;
  ctx.fillText(data.venue, P, y);

  // ━━ Date ━━
  y += 20 * S;
  ctx.fillStyle = COLORS.textLight;
  ctx.fillText(data.date, P, y);

  // ━━ Scalloped tear line ━━
  y += 28 * S;
  const scR = 13 * S;
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(20 * S, y, scR, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(W - 20 * S, y, scR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 1.5 * S;
  ctx.setLineDash([5 * S, 4 * S]);
  ctx.beginPath();
  ctx.moveTo(P + 12 * S, y);
  ctx.lineTo(W - P - 12 * S, y);
  ctx.stroke();
  ctx.restore();

  // ━━ Lower section: Holder info (left) + QR (right) ━━
  y += 28 * S;
  const qrSize = 140 * S;
  const qrPad = 10 * S;
  const qrBoxSize = qrSize + qrPad * 2;
  const qrX = W - P - qrBoxSize;
  const qrY = y - 4 * S;
  const infoMaxW = qrX - P - 20 * S;

  // "TICKET HOLDER"
  setFont(ctx, "700", 10, "'Segoe UI', sans-serif");
  ctx.letterSpacing = `${2 * S}px`;
  ctx.fillStyle = COLORS.primary;
  ctx.fillText("TICKET HOLDER", P, y);
  ctx.letterSpacing = "0px";

  // Holder name
  y += 24 * S;
  setFont(ctx, "bold", 19, "'Georgia', 'Playfair Display', serif");
  ctx.fillStyle = COLORS.text;
  ctx.fillText(truncateText(ctx, data.holderName, infoMaxW), P, y);

  // Holder email
  y += 22 * S;
  setFont(ctx, "400", 12, "'Segoe UI', sans-serif");
  ctx.fillStyle = COLORS.textMuted;
  ctx.fillText(truncateText(ctx, data.holderEmail, infoMaxW), P, y);

  // ━━ Detail columns ━━
  y += 34 * S;
  const cols = [
    { label: "TYPE", value: data.ticketType.toUpperCase() },
    { label: "PRICE", value: data.price === 0 ? "FREE" : `₹${data.price}` },
    { label: "TICKET ID", value: data.ticketId.slice(-8).toUpperCase() },
  ];
  const colW = infoMaxW / cols.length;
  cols.forEach((col, i) => {
    const cx = P + i * colW;
    setFont(ctx, "700", 8, "'Segoe UI', sans-serif");
    ctx.letterSpacing = `${1.5 * S}px`;
    ctx.fillStyle = COLORS.textLight;
    ctx.fillText(col.label, cx, y);
    ctx.letterSpacing = "0px";
    setFont(ctx, "bold", 14, "'Segoe UI', sans-serif");
    ctx.fillStyle = COLORS.text;
    ctx.fillText(col.value, cx, y + 19 * S);
  });

  // ━━ QR Code ━━
  // Cream background box
  roundRect(ctx, qrX, qrY, qrBoxSize, qrBoxSize, 12 * S);
  ctx.fillStyle = COLORS.cream;
  ctx.fill();
  roundRect(ctx, qrX, qrY, qrBoxSize, qrBoxSize, 12 * S);
  ctx.strokeStyle = COLORS.primary;
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = 1.5 * S;
  ctx.stroke();
  ctx.globalAlpha = 1;

  try {
    const qrDataUrl = await QRCode.toDataURL(data.qrCodeToken, {
      width: qrSize,
      margin: 2,
      color: { dark: COLORS.primaryDark, light: "#FFFFFF" },
    });
    const qrImg = await loadImage(qrDataUrl);
    ctx.drawImage(qrImg, qrX + qrPad, qrY + qrPad, qrSize, qrSize);
  } catch {
    setFont(ctx, "400", 11, "sans-serif");
    ctx.fillStyle = COLORS.textLight;
    ctx.textAlign = "center";
    ctx.fillText("QR Code", qrX + qrBoxSize / 2, qrY + qrBoxSize / 2 + 4 * S);
    ctx.textAlign = "start";
  }

  // "SCAN TO ENTER" beneath QR
  setFont(ctx, "700", 8, "'Segoe UI', sans-serif");
  ctx.letterSpacing = `${2 * S}px`;
  ctx.fillStyle = COLORS.textLight;
  ctx.textAlign = "center";
  ctx.fillText("SCAN TO ENTER", qrX + qrBoxSize / 2, qrY + qrBoxSize + 16 * S);
  ctx.textAlign = "start";
  ctx.letterSpacing = "0px";

  // ━━ Team Members ━━
  if (hasTeam && data.teamMembers) {
    // Move y below the detail columns
    y += 44 * S;

    // Divider
    ctx.save();
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = 1 * S;
    ctx.setLineDash([4 * S, 4 * S]);
    ctx.beginPath();
    ctx.moveTo(P, y);
    ctx.lineTo(W - P, y);
    ctx.stroke();
    ctx.restore();

    y += 26 * S;
    setFont(ctx, "700", 10, "'Segoe UI', sans-serif");
    ctx.letterSpacing = `${2 * S}px`;
    ctx.fillStyle = COLORS.primary;
    ctx.fillText("TEAM MEMBERS", P, y);
    ctx.letterSpacing = "0px";

    // Leader row
    y += 26 * S;
    const rowH = 28 * S;
    roundRect(ctx, P, y - rowH * 0.55, IW, rowH, 5 * S);
    ctx.fillStyle = COLORS.secondary;
    ctx.globalAlpha = 0.07;
    ctx.fill();
    ctx.globalAlpha = 1;

    setFont(ctx, "bold", 12, "'Segoe UI', sans-serif");
    ctx.fillStyle = COLORS.text;
    const leaderNameW = ctx.measureText(data.holderName).width;
    ctx.fillText(data.holderName, P + 10 * S, y);

    // "LEADER" badge
    const badgeX = P + 10 * S + leaderNameW + 10 * S;
    const badgeW = 50 * S;
    const badgeH = 16 * S;
    roundRect(ctx, badgeX, y - badgeH * 0.7, badgeW, badgeH, badgeH / 2);
    ctx.fillStyle = COLORS.secondary;
    ctx.globalAlpha = 0.18;
    ctx.fill();
    ctx.globalAlpha = 1;
    setFont(ctx, "bold", 7, "'Segoe UI', sans-serif");
    ctx.letterSpacing = `${1 * S}px`;
    ctx.fillStyle = COLORS.gold;
    ctx.fillText("LEADER", badgeX + 6 * S, y - 1 * S);
    ctx.letterSpacing = "0px";

    // Leader email
    setFont(ctx, "400", 11, "'Segoe UI', sans-serif");
    ctx.fillStyle = COLORS.textMuted;
    ctx.fillText(data.holderEmail, W / 2, y);

    y += 34 * S;

    // Other members
    data.teamMembers.forEach((member) => {
      setFont(ctx, "400", 12, "'Segoe UI', sans-serif");
      ctx.fillStyle = COLORS.text;
      ctx.fillText(`•   ${member.name}`, P + 10 * S, y);
      setFont(ctx, "400", 11, "'Segoe UI', sans-serif");
      ctx.fillStyle = COLORS.textMuted;
      ctx.fillText(member.email, W / 2, y);
      y += 34 * S;
    });
  }

  // ━━ Bottom motif ━━
  drawDiamondMotif(ctx, P, H - 52 * S, IW);

  // ━━ Footer ━━
  setFont(ctx, "italic", 9, "'Georgia', serif");
  ctx.fillStyle = COLORS.textLight;
  ctx.textAlign = "center";
  ctx.fillText(
    "This ticket is for one-time use only  •  Do not share  •  Espektro 2026, KGEC",
    W / 2,
    H - 30 * S,
  );
  ctx.textAlign = "start";

  return canvas.toDataURL("image/webp");
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
