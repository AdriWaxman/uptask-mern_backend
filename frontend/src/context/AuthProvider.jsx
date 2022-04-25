import {useState, useEffect, createContext} from 'react';
import clientAxios from '../config/clientAxios';


const AuthContext = createContext();

const AuthProvider = ({children}) => {

  const [auth,setAuth] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const authUsuario = async (e) => {
      if(!token){
        return;
      }

      const config = {
        headers: {
          "Content-Type":"application/json",
          "Authorization":`Bearer ${token}`
        }
      }

      try {
        const {data} = await clientAxios('/usuarios/perfil',config);
        setAuth(data);

      }
      catch(error){
        console.log(error);
      }
    }
    authUsuario();
  },[]);


  return(
    <AuthContext.Provider
    value={{
      setAuth
    }}>
      {children}
    </AuthContext.Provider>
  )

}

export {AuthProvider};

export default  AuthContext;