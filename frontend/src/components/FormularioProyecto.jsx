import {useState} from 'react'
import useProyectos from '../hooks/useProyectos';
import Alerta from './Alerta';

export const FormularioProyecto = () => {
  const [nombre,setNombre] = useState('');
  const [descripcion,setDescripcion] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [cliente,setCliente] = useState('');

  const {mostrarAlerta, alerta, submitProyecto} = useProyectos();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if([nombre,descripcion,fechaEntrega,cliente].includes('')){
      mostrarAlerta({
        msg: 'Todos los campos son obligatorios',
        error:true
      });
      return;
    }

    //Pasar datos al provider
   await submitProyecto({
      nombre,
      descripcion,
      fechaEntrega,
      cliente
    });
    setNombre('');
    setDescripcion('');
    setFechaEntrega('');
    setCliente('');
  }
  const {msg} = alerta;

  return (
    <form onSubmit={handleSubmit} className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow' >
      {msg && <Alerta alerta={alerta} />}
      <div className="mb-5">
        <label htmlFor="nombre" className="text-gray-700 uppercase font-bold text-sm">Nombre Proyecto <span className='text-red-600 font-bold'>*</span></label>
        <input type="text" className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md" id="nombre" placeholder="Nombre Proyecto" value={nombre} onChange={e => setNombre(e.target.value)}/>
      </div>
      <div className="mb-5">
        <label htmlFor="descripcion" className="text-gray-700 uppercase font-bold text-sm">Descripcion Proyecto <span className='text-red-600 font-bold'>*</span></label>
        {/* <input type="text" className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md" id="descripcion" placeholder="Descripcion Proyecto" value={descripcion} onChange={e => setDescripcion(e.target.value)}/> */}
        <textarea name="descripcion" id="descripcion" cols="30" rows="5" className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md" placeholder="Descripcion Proyecto" value={descripcion} onChange={e => setDescripcion(e.target.value)}></textarea>
      </div>
      <div className="mb-5">
        <label htmlFor="fecha-entrega" className="text-gray-700 uppercase font-bold text-sm">Fecha Entrega</label>
        <input type="date" className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md" id="fecha-entrega" value={fechaEntrega} onChange={e => setFechaEntrega(e.target.value)}/>
       
      </div>
      <div className="mb-5">
        <label htmlFor="cliente" className="text-gray-700 uppercase font-bold text-sm">Nombre cliente <span className='text-red-600 font-bold'>*</span></label>
        <input type="text" className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md" id="cliente" placeholder="Nombre cliente" value={cliente} onChange={e => setCliente(e.target.value)}/>
      </div>

      <input type="submit" className='bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors' value="Crear proyecto" />

    </form>
  )
}
