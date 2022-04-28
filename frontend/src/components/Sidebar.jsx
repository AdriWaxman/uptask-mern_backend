import {Link} from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export const Sidebar = () => {

  const {auth} = useAuth();

  console.log(auth)

  return (
    <aside className="md:w-80 lg:w-96 px-5 py-10">
      <p className="text-xl font-bold">Hola: {auth.nombre}</p>

      <Link to="crear-proyecto" className='bg-sky-600 w-full text-white uppercase p-3 font-bold block text-center rounded-lg mt-5'>Nuevo Proyecto</Link>
    </aside>
  )
}
