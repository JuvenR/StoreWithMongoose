import ventaDAO from '../dao/VentaDAO.js';
import { AppError } from '../utils/appError.js';

class VentaController {

    static async crearVenta(req, res, next) {
        try {
            const { total, iva, productosventa } = req.body;

            if (total === undefined || iva === undefined || !Array.isArray(productosventa) || productosventa.length === 0) {
                return next(new AppError('Los campos total, iva y productosventa son requeridos y deben tener valores validos', 400));
            }

            if (isNaN(total) || isNaN(iva)) {
                return next(new AppError('Los campos total e iva deben ser numeros', 400));
            }

            const ventaData = {
                total: Number(total),
                iva: Number(iva),
                productosventa
            };

            const venta = await ventaDAO.crearVenta(ventaData);

            res.status(201).json({
                status: 'success',
                data: venta
            });

        } catch (error) {
            next(new AppError('Ocurrió un error al crear la venta', 500));
        }
    }

    static async agregaProductosAVenta(req, res, next) {
        try {
            const { idVenta, productos } = req.body;

            if (!idVenta || !Array.isArray(productos) || productos.length === 0) {
                return next(new AppError('Los campos idVenta y productos son requeridos y deben ser validos', 400));
            }

            const ventaActualizada = await ventaDAO.agregaProductosAVenta(idVenta, productos);

            if (!ventaActualizada) {
                return next(new AppError('No se pudo agregar productos a la venta. Verifique el ID.', 404));
            }

            res.status(200).json({
                status: 'success',
                message: 'Productos agregados correctamente a la venta',
                data: ventaActualizada
            });

        } catch (error) {
            next(new AppError('Ocurrio un error al agregar productos a la venta', 500));
        }
    }
}

export default VentaController;
