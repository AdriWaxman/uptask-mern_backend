import { formatearFecha } from "../helpers/formatearFecha";

export const Tarea = ({tarea}) => {

  const {descripcion, nombre, prioridad, fechaEntrega, _id, estado} = tarea;

  return (
    <div className="border-b p-5 flex justify-between items-center">
      <div>
        <p className="text-xl mb-1 font-bold">{nombre}</p>
        <p className="text-sm text-gray-500 uppercase mb-1">{descripcion}</p>
        <p className="text-xl mb-1">{formatearFecha(fechaEntrega)}</p>
        <p className="text-gray-600 mb-1">Prioridad: {prioridad}</p>
      </div>
      <div className="flex gap-2">
        <button className="bg-indigo-600 font-bold py-3 px-4 uppercase text-sm rounded-lg text-white">Editar</button>
        {estado ? 
        (<button className="bg-green-600 font-bold py-3 px-4 uppercase text-sm rounded-lg text-white">Completa</button>) : 
        (<button className="bg-gray-600 font-bold py-3 px-4 uppercase text-sm rounded-lg text-white">Incompleta</button>)
        }
        
        <button className="bg-red-600 font-bold py-3 px-4 uppercase text-sm rounded-lg text-white">Eliminar</button>
      </div>
    </div>
  )
}
