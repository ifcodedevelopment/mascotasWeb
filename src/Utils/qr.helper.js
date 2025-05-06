import QRCode from 'qrcode';

/**
 * Genera un QR en base64 a partir de un texto
 * @param texto - Texto que se desea codificar
 * @param opciones - Opciones de personalización (color, tamaño, etc.)
 * @return- Imagen QR en base64
 */
export const generarQR = async (texto, opciones = {}) => {
    const defaultOptions = {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        color: {
            dark: '#000000',
            light: '#ffffff',
        },
        margin: 1,
        width: 200
    };

    return await QRCode.toDataURL(texto, { ...defaultOptions, ...opciones });
};
