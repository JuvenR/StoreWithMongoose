import jwt from 'jsonwebtoken';
import { AppError } from './appError.js';

const validateJWT = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return next(new AppError('No se proporciono un token', 400));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();

    } catch (error) {
        return next(new AppError('El token no es valido', 401));
    }
}

export default validateJWT;
