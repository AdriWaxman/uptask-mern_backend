import { useState, useEffect, createContext } from 'react';
import clientAxios from '../config/clientAxios';
import {useNavigate} from 'react-router-dom';

const ProyectosContext = createContext();

const ProyectosProvider = ({children}) => {
  
  const [proyectos, setProyectos] = useState([]);
  const [alerta,setAlerta] = useState({});
  const [proyecto, setProyecto] = useState({});
  const [cargando, setCargando] = useState(false);
  const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
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
      if(proyecto.id){
          await editarProyecto(proyecto);
      }else{
        await nuevoProyecto(proyecto);
      }
      return;
   
}

const editarProyecto = async proyecto => {
    
  try {
    const token = localStorage.getItem('token');
    if(!token) return;

    const config = {
      headers: {
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token}`
      }
    }

    const {data} = await clientAxios.put(`/proyectos/${proyecto.id}`, proyecto, config);

    //Sincronizar state
    const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState);
    
    setProyectos(proyectosActualizados);
    mostrarAlerta({
      msg: 'Proyecto editado correctamente',
      error: false
    });

    setTimeout(() =>{
      setAlerta({});
      //navigate(`/proyectos/${proyecto.id}`);
      navigate(`/proyectos`);
     }, 3000);
    
  } catch (error) {
    console.log(error);
  }
}

const nuevoProyecto = async proyecto => {
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

const eliminarProyecto = async(id) => {
  
  try {
    const token = localStorage.getItem('token');
    if(!token) return;

    const config = {
      headers: {
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token}`
      }
    }

    const { data } = await clientAxios.delete(`/proyectos/${id}`, config);

    //Sincronizar state
    const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id);
    setProyectos(proyectosActualizados);

    setAlerta({
      msg:data.msg,
      error:false
    })

    setTimeout(() => {
        setAlerta({});
        navigate('/proyectos');
    },3000)

  } catch (error) {
    console.log(error);
  }
}

const handleModalTarea = () => {
  setModalFormularioTarea(!modalFormularioTarea);
}

const submitTarea = async tarea => {
  console.log(tarea)
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
        cargando,
        eliminarProyecto,
        modalFormularioTarea,
        handleModalTarea,
        submitTarea
      }}
    >
      {children}
    </ProyectosContext.Provider>
  )
}

export { ProyectosProvider};

export default ProyectosContext;