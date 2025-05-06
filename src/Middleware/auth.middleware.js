import jwt from 'jsonwebtoken';
import { SECRET_KEY_JWT } from '../Config/config.js';

export const validarToken = (req, res, next) => {
    // Aceptar formato bearer como solo token 
    const authHeader = req.headers['authorization'];
    const tokenFromAuth = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const token = tokenFromAuth || req.headers['token'];

    if (!token) {
        return res.status(401).json({
            status: 401,
            response: {
                text: 'Token no proporcionado'
            }
        });
    }

    try {
        const payload = jwt.verify(token, SECRET_KEY_JWT);
        req.idUsuario = payload.id;
        next();
    } catch (error) {
        return res.status(403).json({
            status: 403,
            response: {
                text: 'Token inválido o expirado'
            }
        });
    }
};
