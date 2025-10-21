import express from 'express';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { conectar } from './config/db.js';
import productoRouter from './routers/ProductoRouter.js';
import ventaRouter from './routers/VentaRouter.js';
import corsMiddleware from './utils/validateCORS.js';
import validateJWT from './utils/validateJWT.js';
import { AppError, globalErrorHandler } from './utils/appError.js'; 

// Cargar las variables de entorno desde .env
dotenv.config();

// Conectar a la base de datos
conectar();

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan('combined'));
app.use(corsMiddleware); // Middleware CORS

// Ruta de login basica (solo para pruebas)
app.post('/api/users/login', (req, res, next) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'password') {
        const payload = {
            userId: 1,
            username: 'admin',
            role: 'admin',
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({
            msg: 'Inicio de sesion exitoso',
            token,
        });

    } else {
        return next(new AppError('Usuario o contrasena invalidos', 401));
    }
});

// Rutas protegidas con JWT
app.use('/api/productos', validateJWT, productoRouter);

// Ruta de ventas (publica o protegida segun necesidad)
app.use('/api/ventas', ventaRouter); // Puedes agregar validateJWT si quieres protegerla

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
    const error = new AppError(`No se pudo acceder a ${req.originalUrl} en el servidor`, 404);
    next(error);
});

// Manejador global de errores
app.use(globalErrorHandler);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
