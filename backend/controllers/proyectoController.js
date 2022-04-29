import mongoose from 'mongoose';
import Proyecto from '../models/Proyecto.js';
import Tarea from '../models/Tarea.js';

//Obtener proyectos
const obtenerProyectos = async (req, res) => {
  // const proyectos = await Proyecto.find({ creador: req.usuario._id });
  const proyectos = await Proyecto.find().where('creador').equals(req.usuario);

  // if(!proyectos) {
  //   return res.status(404).json({
  //     msg: 'No hay proyectos'
  //   });
  // }

  res.json(
    proyectos
  );
}

//Nuevo proyecto
const nuevoProyecto = async (req, res) => {
  const proyecto = new Proyecto(req.body);
  proyecto.creador = req.usuario._id;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    res.status(400).json({
      msg: 'Hubo un error al crear el proyecto',
      error
    });
  }
}

//Obtener proyecto
const obtenerProyecto = async (req, res) => {
  const {id} = req.params;

  //Mirar si id es válido
  const valid = mongoose.Types.ObjectId.isValid(id);
  if(!valid) {
    const error = new Error('El proyecto no existe');
    return res.status(404).json({
      msg: error.message
    });
  }
  const proyecto = await Proyecto.findById(id);

  if(!proyecto) {
    const error = new Error("No encontrado")
    return res.status(404).json({
      msg: error.message
    });
  }


  if(proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Usuario no autorizado")
    return res.status(401).json({
      msg: error.message
    });
  }

  //Obtener tareas del proyecto
  //const tareas = await Tarea.find().where('proyecto').equals(proyecto._id);

  res.json(proyecto);
}

//Editar proyecto
const editarProyecto = async (req, res) => {

  const {id} = req.params;

  //Mirar si id es válido
  const valid = mongoose.Types.ObjectId.isValid(id);
  if(!valid) {
    const error = new Error('El proyecto no existe');
    return res.status(404).json({
      msg: error.message
    });
  }
  const proyecto = await Proyecto.findById(id);

  if(!proyecto) {
    const error = new Error("No encontrado")
    return res.status(404).json({
      msg: error.message
    });
  }


  if(proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Usuario no autorizado")
    return res.status(401).json({
      msg: error.message
    });
  }

  proyecto.nombre = req.body.nombre || proyecto.nombre
  proyecto.descripcion = req.body.descripcion || proyecto.descripcion
  proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega
  proyecto.cliente = req.body.cliente || proyecto.cliente

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  }
  catch (error) {
    console.log(error);
  }


}

//Eliminar proyecto
const eliminarProyecto = async (req, res) => {
  //Validar si pertenece al usuario
  const {id} = req.params;

  //Mirar si id es válido
  const valid = mongoose.Types.ObjectId.isValid(id);
  if(!valid) {
    const error = new Error('El proyecto no existe');
    return res.status(404).json({
      msg: error.message
    });
  }
  const proyecto = await Proyecto.findById(id);

  if(!proyecto) {
    const error = new Error("No encontrado")
    return res.status(404).json({
      msg: error.message
    });
  }


  if(proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Usuario no autorizado")
    return res.status(401).json({
      msg: error.message
    });
  }

  try {
    await proyecto.deleteOne();
    res.json({
      msg: 'Proyecto eliminado'
    });
  }
  catch (error) {
    console.log(error);
  }

}

//Agregar colaborador
const agregarColaborador = async (req, res) => {
}

//Eliminar colaborador
const eliminarColaborador = async (req, res) => {
}



export { obtenerProyectos, nuevoProyecto, obtenerProyecto, editarProyecto, eliminarProyecto, agregarColaborador, eliminarColaborador };