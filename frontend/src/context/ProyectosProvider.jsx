import { useState, useEffect, createContext } from 'react';
import clientAxios from '../config/clientAxios';
import {useNavigate} from 'react-router-dom';

const ProyectosContext = createContext();

const ProyectosProvider = ({children}) => {
  
  const [proyectos, setProyectos] = useState([]);
  const [alerta,setAlerta] = useState({});
  const [proyecto, setProyecto] = useState({});
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerProyectos = async () => {
      try {
        const token = localStorage.getItem('token');
        if(!token) return;

        const config = {
          headers: {
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`
          }
        }

        const {data} = await clientAxios('/proyectos', config);
       setProyectos(data);

      } catch (error) {
        console.log(error);
      }
    }
    obtenerProyectos();

  }, []);
  const mostrarAlerta = alerta => {
    setAlerta(alerta);

    setTimeout(() =>{
      setAlerta({});
    }, 3000);
  }

 
  const submitProyecto = async(proyecto) => {
    //console.log(proyecto);
    try {
      const token = localStorage.getItem('token');
      if(!token) return;

      const config = {
        headers: {
          "Content-Type":"application/json",
          "Authorization":`Bearer ${token}`
        }
      }

      const { data } = await clientAxios.post('/proyectos', proyecto, config);
      setProyectos([...proyectos, data]);

     setAlerta({
        msg:"Proyecto creado correctamente",
        error:false
      })

      setTimeout(() =>{
        setAlerta({});
        navigate('/proyectos');
       }, 3000);

    } catch (error) {
      console.log(error);
      
    }
}

const obtenerProyecto = async(id) => {
  setCargando(true);
  try {
    const token = localStorage.getItem('token');
    if(!token) return;

    const config = {
      headers: {
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token}`
      }
    }

    const { data } = await clientAxios(`/proyectos/${id}`, config);
    setProyecto(data);
    
  } catch (error) {
    console.log(error);
  } finally {
    setCargando(false);
  }
}

  return(
    <ProyectosContext.Provider
      value={{
        proyectos,
        mostrarAlerta,
        alerta,
        submitProyecto, 
        obtenerProyecto,
        proyecto,
        cargando
      }}
    >
      {children}
    </ProyectosContext.Provider>
  )
}

export { ProyectosProvider};

export default ProyectosContext;