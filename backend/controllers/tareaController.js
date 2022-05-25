import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";


//Agregar nueva Tarea
const agregarTarea = async (req,res) => {
  const {proyecto} = req.body;

  const existeProyecto = await Proyecto.findById(proyecto);

  if(!existeProyecto){
    const error = new Error('Proyecto no encontrado');
    return res.status(404).json({
      error: error.message
    });
  }

  //Comprobar si la persona que esta creando la tarea es la misma que el proyecto
  if(existeProyecto.creador.toString() !== req.usuario.id){
    const error = new Error('No tienes permiso para agregar una tarea a este proyecto');
    return res.status(403).json({
      error: error.message
    });
  }

  try {
    const tareaAlmacenada = await Tarea.create(req.body);
    //Almacenar el ID del proyecto
    existeProyecto.tareas.push(tareaAlmacenada._id);
    await existeProyecto.save();
    res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error)
  }
}

//Obtener tarea
const obtenerTarea = async (req,res) => {

    const {id} = req.params;

    const tarea = await Tarea.findById(id).populate('proyecto');

    if(!tarea){
      const error = new Error('Tarea no encontrada');
      return res.status(404).json({
        error: error.message
      });
    }
    
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
      const error = new Error('No tienes permiso para ver esta tarea');
      return res.status(403).json({
        error: error.message
      });
    }
    try {
    res.json(tarea);
  } catch (error) {
    console.log(error)
  }
}

//Actualizar tarea
const actualizarTarea = async (req,res) => {
  const {id} = req.params;

  const tarea = await Tarea.findById(id).populate('proyecto');

  if(!tarea){
    const error = new Error('Tarea no encontrada');
    return res.status(404).json({
      error: error.message
    });
  }
  
  if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
    const error = new Error('No tienes permiso para ver esta tarea');
    return res.status(403).json({
      error: error.message
    });
  }

    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;
    tarea.prioridad = req.body.prioridad || tarea.prioridad;

    try {
    const tareaAlmacenada = await tarea.save();
    res.json(tareaAlmacenada) 
    } catch (error) {
      console.log(error)
    }

}

//Eliminar tarea
const eliminarTarea = async (req,res) => {
  const {id} = req.params;

  const tarea = await Tarea.findById(id).populate('proyecto');

  if(!tarea){
    const error = new Error('Tarea no encontrada');
    return res.status(404).json({
      error: error.message
    });
  }
  
  if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
    const error = new Error('No tienes permiso para ver esta tarea');
    return res.status(403).json({
      error: error.message
    });
  }

  try {
    const proyecto = await Proyecto.findById(tarea.proyecto);
    proyecto.tareas.pull(tarea._id);
  

    await Promise.allSettled([
      proyecto.save(),
      tarea.deleteOne(),
    ]);
    
    res.json({
      message: 'Tarea eliminada con éxito'
    })
  }
  catch (error) {
    console.log(error)
  }
}

//Cambiar estado de tarea
const cambiarEstado = async (req,res) => {
  const {id} = req.params;

  const tarea = await Tarea.findById(id).populate('proyecto');

  if(!tarea){
    const error = new Error('Tarea no encontrada');
    return res.status(404).json({
      error: error.message
    });
  }

  if(tarea.proyecto.creador.toString() !== req.usuario._id.toString() && !tarea.proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())){
    const error = new Error('No tienes permiso para ver esta tarea');
    return res.status(403).json({
      error: error.message
    });
  }
  //cambiar estado tarea y guardar
  tarea.estado = !tarea.estado;
  tarea.completado = req.usuario._id;

  await tarea.save();
  const tareaAlmacenada = await Tarea.findById(id).populate('proyecto').populate('completado');
  res.json(tareaAlmacenada);
 


  
}

export {agregarTarea, obtenerTarea, actualizarTarea, eliminarTarea, cambiarEstado};



