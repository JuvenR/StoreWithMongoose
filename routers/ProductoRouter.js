import express from 'express';
import ProductoController from '../controllers/ProductoController.js'

const router = express.Router();

router.get('/', ProductoController.obtenerProductos);
router.get('/:id', ProductoController.obtenerProductoPorId);
router.post('/', ProductoController.crearProducto);
router.put('/:id', ProductoController.actualizarProducto);
router.delete('/:id', ProductoController.eliminarProducto);

export default router;