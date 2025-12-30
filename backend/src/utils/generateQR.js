import QRCode from 'qr-image';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateQRCode = (trackingNumber, parcelId) => {
  try {
    const uploadDir = path.join(__dirname, '../../uploads/qrcodes');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const qr_png = QRCode.imageSync(trackingNumber, { type: 'png' });
    const filename = `qr_${parcelId}_${Date.now()}.png`;
    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, qr_png);

    return `/uploads/qrcodes/${filename}`;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
};