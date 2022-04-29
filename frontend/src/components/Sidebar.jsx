import {Link} from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export const Sidebar = () => {

  const {auth} = useAuth();

  
  return (
    <aside className="md:w-80 lg:w-96 px-5 py-10 bg-gray-200 md:border-r-2 border-gray-300 sm:border-b-2 sm:border-r-0">
      <p className="text-xl font-bold">Hola: {auth.nombre}</p>

      <Link to="crear-proyecto" className='bg-sky-600 w-full text-white uppercase p-3 font-bold block text-center rounded-lg mt-5'>Nuevo Proyecto</Link>
    </aside>
  )
}
