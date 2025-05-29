import QRCode from 'qrcode';
import { createRequire } from 'module';
import fs from 'fs';

const require = createRequire(import.meta.url);
const Jimp = require('jimp');

/**
 * Genera un QR con sombra y logo centrado en círculo blanco (sin máscara)
 * @param {string} texto - Texto a codificar
 * @param {string|null} rutaLogo - Ruta local al logo (opcional)
 * @returns {Promise<string>} - Imagen QR en base64
 */
export const generarQRConEstilo = async (texto, rutaLogo = null) => {
  const qrBuffer = await QRCode.toBuffer(texto, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    width: 400,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });

  const qr = await Jimp.read(qrBuffer);

  // Crear sombra
  //const sombra = new Jimp(qr.bitmap.width + 20, qr.bitmap.height + 20, 0x00000000);
  const sombra = new Jimp(qr.bitmap.width, qr.bitmap.height, 0x00000000);
  const blur = qr.clone().blur(8).opacity(0.25);
  sombra.composite(blur, 10, 10);
  sombra.composite(qr, 0, 0);

  // Logo con fondo circular
  if (rutaLogo && fs.existsSync(rutaLogo)) {
    const logo = await Jimp.read(rutaLogo);
    const size = qr.bitmap.width * 0.4;

    // Fondo circular blanco
    const fondo = new Jimp(size, size, 0xffffffff);

    // Redimensionar logo ligeramente más pequeño
    logo.contain(size * 0.9, size * 0.9);

    // Centrar el logo sobre el fondo blanco
    const offset = (size - logo.bitmap.width) / 2;
    fondo.composite(logo, offset, offset);

    const x = (sombra.bitmap.width - size) / 2;
    const y = (sombra.bitmap.height - size) / 2;
    sombra.composite(fondo, x, y);
  }

  const finalBuffer = await sombra.getBufferAsync(Jimp.MIME_PNG);
  return `data:image/png;base64,${finalBuffer.toString('base64')}`;
};
