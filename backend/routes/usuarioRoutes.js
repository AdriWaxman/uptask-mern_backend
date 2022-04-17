import express from 'express';
import { registrar, login, confirmar, recuperarPassword, comprobarToken, nuevoPassword, perfil } from '../controllers/usuarioController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

//Autentificacion, registro y confirmacion de usuarios

router.post('/', registrar);
router.post('/login', login);
router.get('/confirmar/:token', confirmar);
router.post('/recuperar-password', recuperarPassword);
// router.get('/recuperar-password/:token', comprobarToken);
// router.post('/recuperar-password/:token', nuevoPassword);
router.route('/recuperar-password/:token').get(comprobarToken).post(nuevoPassword);

router.get('/perfil', checkAuth, perfil)



export default router;