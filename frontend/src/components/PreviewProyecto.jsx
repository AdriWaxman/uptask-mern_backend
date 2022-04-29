import { Link } from 'react-router-dom';

export const PreviewProyecto = ({proyecto}) => {
  const { nombre, _id, cliente} = proyecto;
  return (
    <div className='border-b p-5 flex hover:bg-slate-200 transition-color duration-300'>
      <p className='flex-1'>{nombre} <span className='bg-gray-400 text-white rounded-xl p-2 text-xs uppercase'>{cliente}</span></p>
      <Link to={`${_id}`} className='text-gray-600 hover:text-gray-800 font-bold text-sm'>Ver proyecto</Link>
    </div>
  )
}
