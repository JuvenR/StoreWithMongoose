import express from 'express';
import VentaController from '../controllers/VentaController.js';

const router = express.Router();

router.post('/', VentaController.crearVenta);
router.post('/', VentaController.agregaProductosAVenta);

export default router;