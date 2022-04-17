import express from 'express';
import {obtenerProyectos, nuevoProyecto, obtenerProyecto, editarProyecto, eliminarProyecto, agregarColaborador, eliminarColaborador} from '../controllers/proyectoController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

// router.get('/', checkAuth, obtenerProyectos);
// router.post('/',checkAuth, nuevoProyecto);
router.route('/').get(checkAuth, obtenerProyectos).post(checkAuth, nuevoProyecto);
// router.get('//:id', obtenerProyecto);
// router.put('/:id', editarProyecto);
// router.delete('/:id', eliminarProyecto);
router.route('/:id').get(checkAuth, obtenerProyecto).put(checkAuth, editarProyecto).delete(checkAuth, eliminarProyecto);

router.post('/agregar-colaborador/:id', checkAuth, agregarColaborador);
router.post('/eliminar-colaborador/:id', checkAuth, eliminarColaborador); //Se usa post porque no se elimina el colaborador, se elimina la relacion

export default router;












