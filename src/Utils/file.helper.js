import fs from 'fs';
import path from 'path';

/**
 * Guarda una imagen en base64 en una carpeta específica
 * @param base64Data - Imagen en base64
 * @param idUsuario - ID del usuario
 * @param nombreArchivo - Nombre deseado para el archivo (sin extensión)
 * @returns Ruta relativa donde se guardó la imagen
 */
export const guardarImagenBase64 = (base64Data, idUsuario, nombreArchivo, req) => {
    const matches = base64Data.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
    if (!matches) throw new Error('Base64 inválido');

    const extension = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');

    const carpetaUsuario = path.join('uploads', String(idUsuario));
    if (!fs.existsSync(carpetaUsuario)) fs.mkdirSync(carpetaUsuario, { recursive: true });

    const nombreFinal = `${nombreArchivo}.${extension}`;
    const rutaArchivo = path.join(carpetaUsuario, nombreFinal);
    fs.writeFileSync(rutaArchivo, buffer);

    const rutaWeb = path.join('uploads', String(idUsuario), nombreFinal).replace(/\\/g, '/');
    return `${req.protocol}://${req.get('host')}/${rutaWeb}`;
};
