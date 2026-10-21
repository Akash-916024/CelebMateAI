/**
 * CelebMate AI — PDF & Print Utility for Invitation Cards
 * Formats celebration cards for browser-native Save-as-PDF and printing
 * @module utils/pdf-printer
 */

/**
 * Opens a formatted print preview window for the invitation card.
 * Triggers the browser's native Print / Save-as-PDF dialog.
 * @param {string} title - The event title / honoree headline
 * @param {string} messageText - The formatted invitation message text
 */
export function exportInvitationToPdf(title, messageText) {
  const printWindow = window.open('', '_blank', 'width=720,height=850');
  if (!printWindow) {
    window.print();
    return;
  }

  // Convert any line breaks to safe paragraphs or linebreaks
  const formattedHtml = messageText
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title || 'Celebration Invitation'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #fdfbf7;
      font-family: 'Inter', sans-serif;
      color: #2c1810;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 24px;
    }
    .print-card {
      width: 100%;
      max-width: 580px;
      padding: 40px 32px;
      background: #ffffff;
      border: 4px double #d4af37;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(212, 175, 55, 0.2);
      text-align: center;
    }
    .motif { font-size: 26px; color: #d4af37; margin-bottom: 8px; letter-spacing: 6px; }
    .card-title {
      font-family: 'Outfit', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: #c2185b;
      margin-bottom: 12px;
    }
    .divider {
      height: 2px;
      background: linear-gradient(90deg, transparent, #d4af37, transparent);
      margin: 16px 0 20px;
      border: none;
    }
    .card-body {
      font-size: 15px;
      line-height: 1.8;
      text-align: left;
      color: #2c1810;
    }
    .card-body p { margin-bottom: 12px; }
    .card-footer {
      margin-top: 24px;
      font-size: 13px;
      color: #8c6d36;
      font-style: italic;
    }
    @media print {
      body { background: transparent; padding: 0; }
      .print-card { box-shadow: none; border-color: #997a15; }
    }
  </style>
</head>
<body>
  <div class="print-card">
    <div class="motif">✨ 🪔 🌸 🪔 ✨</div>
    <div class="card-title">${title || 'Celebration Invitation'}</div>
    <hr class="divider">
    <div class="card-body"><p>${formattedHtml}</p></div>
    <div class="card-footer">Crafted with CelebMate AI</div>
  </div>
  <script>
    window.onload = function() {
      window.print();
    };
  <\/script>
</body>
</html>`;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
