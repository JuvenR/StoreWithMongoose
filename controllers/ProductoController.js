import ProductoDAO from '../dao/ProductoDAO.js';
import { AppError } from '../utils/appError.js';

class ProductoController {

    static async crearProducto(req, res, next) {
        try {
            const { nombre, precio, cantidad } = req.body;

            if (!nombre || precio === undefined || cantidad === undefined) {
                return next(new AppError('Los campos nombre, precio y cantidad son requeridos', 400));
            }

            if (isNaN(precio) || isNaN(cantidad)) {
                return next(new AppError('Los campos precio y cantidad deben ser numeros', 400));
            }

            const productoData = {
                nombre: nombre.trim(),
                precio: Number(precio),
                cantidad: Number(cantidad)
            };

            const producto = await ProductoDAO.crearProducto(productoData);

            res.status(201).json({
                status: 'success',
                data: producto
            });

        } catch (error) {
            next(new AppError('Ocurrio un error al crear el producto', 500));
        }
    }

    static async obtenerProductoPorId(req, res, next) {
        try {
            const { id } = req.params;

            const producto = await ProductoDAO.obtenerProductoPorId(id);

            if (!producto) {
                return next(new AppError(`Producto con ID ${id} no encontrado`, 404));
            }

            res.status(200).json({
                status: 'success',
                data: producto
            });

        } catch (error) {
            next(new AppError('Ocurrio un error al obtener el producto', 500));
        }
    }

    static async obtenerProductos(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 10;

            if (limit <= 0) {
                return next(new AppError('El parametro limit debe ser un numero mayor a 0', 400));
            }

            const productos = await ProductoDAO.obtenerProductos(limit);

            res.status(200).json({
                status: 'success',
                results: productos.length,
                data: productos
            });

        } catch (error) {
            next(new AppError('Ocurrio un error al obtener los productos', 500));
        }
    }

    static async actualizarProducto(req, res, next) {
        try {
            const { id } = req.params;

            const productoExistente = await ProductoDAO.obtenerProductoPorId(id);

            if (!productoExistente) {
                return next(new AppError(`Producto con ID ${id} no encontrado`, 404));
            }

            const productoData = req.body;

            const productoActualizado = await ProductoDAO.actualizarProductoPorId(id, productoData);

            if (!productoActualizado) {
                return next(new AppError('No se pudo actualizar el producto', 500));
            }

            res.status(200).json({
                status: 'success',
                data: productoActualizado
            });

        } catch (error) {
            next(new AppError('Ocurrio un error al actualizar el producto', 500));
        }
    }

    static async eliminarProducto(req, res, next) {
        try {
            const { id } = req.params;

            const productoExistente = await ProductoDAO.obtenerProductoPorId(id);

            if (!productoExistente) {
                return next(new AppError(`Producto con ID ${id} no encontrado`, 404));
            }

            await ProductoDAO.eliminarProductoPorId(id);

            res.status(200).json({
                status: 'success',
                message: 'Producto eliminado correctamente'
            });

        } catch (error) {
            next(new AppError('Ocurrio un error al eliminar el producto', 500));
        }
    }
}

export default ProductoController;
