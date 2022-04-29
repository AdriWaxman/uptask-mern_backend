import { useEffect } from 'react';
import {useParams} from 'react-router-dom';
import  useProyectos from '../hooks/useProyectos';

export const Proyecto = () => {
  const params = useParams();
  const {obtenerProyecto, proyecto, cargando} = useProyectos();

  useEffect(() => {
    obtenerProyecto(params.id);
  }, []);

  const {nombre} = proyecto;

  return (
    cargando ? <p>Cargando...</p> : (
      <div>
      <h1 className="font-black text-4xl">{nombre}</h1>
    </div>
    )
   
  )
}
