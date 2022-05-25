import mongoose from 'mongoose';
import Proyecto from '../models/Proyecto.js';
import User from '../models/User.js';

//Obtener proyectos
const obtenerProyectos = async (req, res) => {
  // const proyectos = await Proyecto.find({ creador: req.usuario._id });
  const proyectos = await Proyecto.find({
    '$or': [
      { 'creador': { $in: req.usuario} },
      { 'colaboradores': { $in: req.usuario}}
    ]
  }).select('-tareas');

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
  const proyecto = await Proyecto.findById(id).populate({path: 'tareas', populate:{path: 'completado', select: 'nombre'}}).populate('colaboradores', 'nombre email');

  if(!proyecto) {
    const error = new Error("No encontrado")
    return res.status(404).json({
      msg: error.message
    });
  }


  if(proyecto.creador.toString() !== req.usuario._id.toString() && !proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())) {
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

//Buscar colaborador
const buscarColaborador = async (req, res) => {
  const {email} = req.body;
  const usuario = await User.findOne({email}).select("-password -createdAt -updatedAt -__v -token -confirmado");

  if(!usuario) {
    const error = new Error("Usuario no encontrado")
    return res.status(404).json({
      msg: error.message
    });
  }

  res.json(usuario);
}

//Agregar colaborador
const agregarColaborador = async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id);

  if(!proyecto){
    const error = new Error("Proyecto no encontrado")
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

  const {email} = req.body;
  const usuario = await User.findOne({email}).select("-password -createdAt -updatedAt -__v -token -confirmado");

  if(!usuario){
    const error = new Error("Usuario no encontrado")
    return res.status(404).json({
      msg: error.message
    });
  }

  //Colaborador no es el admin del proyecto
  if(proyecto.creador.toString() === usuario._id.toString()) {
    const error = new Error("El creador del proyecto no puede ser colaborador")
    return res.status(401).json({
      msg: error.message
    });
  }

  //Revisar que no este agregado al proyecto
  if(proyecto.colaboradores.includes(usuario._id)) {
    const error = new Error("El usuario ya es colaborador del proyecto")
    return res.status(401).json({
      msg: error.message
    });
  }

  //Agregar usuario al proyecto
  proyecto.colaboradores.push(usuario._id);
  await proyecto.save();
  res.json({
    msg: 'Colaborador agregado correctamente'
  })
}


//Eliminar colaborador
const eliminarColaborador = async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id);

  if(!proyecto){
    const error = new Error("Proyecto no encontrado")
    return res.status(404).json({
      msg: error.message
    });
  }

  if(proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no autorizada")
    return res.status(401).json({
      msg: error.message
    });
  }

   //Eliminar usuario del proyecto
   proyecto.colaboradores.pull(req.body.id);
  
   await proyecto.save();
   res.json({
     msg: 'Colaborador eliminado correctamente'
   })

 
}



export { obtenerProyectos, nuevoProyecto, obtenerProyecto, editarProyecto, eliminarProyecto,buscarColaborador, agregarColaborador, eliminarColaborador };