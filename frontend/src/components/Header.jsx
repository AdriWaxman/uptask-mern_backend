import {Link, useNavigate} from 'react-router-dom';

export const Header = () => {

  const navigate = useNavigate();
  //cerrar sesion
  const cerrarSesion = e => {
    e.preventDefault();
    localStorage.removeItem('token');
   
    navigate('/');
  }

  return (
    <header className="px-4 py-5 bg-white border-b">
      <div className="md:flex md:justify-between">
        <h2 className="text-4xl text-sky-600 font-black text-center">Uptask</h2>

        <input type="search" 
          className="rounded-lg lg:w-96 block p-2 border focus:outline-none focus:border-sky-600 focus:bg-gray-200 focus:placeholder-sky-600"
          placeholder="Buscar proyecto"
        />
        <div className='flex items-center gap-4' >
          <Link className="font-bold uppercase" to="/proyectos">Proyectos</Link>
          <button className='text-white text-sm bg-sky-600 rounded-md uppercase font-bold p-3 hover:bg-sky-700 transition-colors' type="button" onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </div>
    </header>
  )
}
