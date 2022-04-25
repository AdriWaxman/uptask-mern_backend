import Usuario from '../models/User.js';
import generarId from '../helpers/generarId.js';
import generarJWT from '../helpers/generarJWT.js';
import { emailRegistro, emailOlvidePassword } from '../helpers/email.js';

//Registar usuario
const registrar = async (req, res) => {

  //Evitar registro de usuarios duplicados
  const usuarioExistente = await Usuario.findOne({ email: req.body.email });
  if (usuarioExistente) {
    const error = new Error('El usuario ya está registrado');
    return res.status(400).json({ msg: error.message });
  }

    try {
      const usuario = new Usuario(req.body);
      usuario.token = generarId();
      await usuario.save();

      //Enviar email de confirmacion
      emailRegistro({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
      });

      res.json({
        msg: 'Usuario registrado con éxito, revisa tu email para confirmar tu cuenta.'
      });

    } catch (error) {
      console.log(error)
    }
};

//Autentificacion
const login = async (req, res) => {

  const { email, password } = req.body;

  //Comprobar si el usuario existe
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    const error = new Error('El usuario no existe');
    return res.status(404).json({ msg: error.message });
  }
  //Comprobar si el usuario esta confirmado
  if (!usuario.confirmado) {
    const error = new Error('Tu cuenta no ha sido confirmada');
    return res.status(403).json({ msg: error.message });
  }
  //Comprobaremos si el password es correcto
  if(await usuario.comprobarPassword(password)) {
    console.log("correcto");
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id)
    });
    
  } else {
    const error = new Error('El password es incorrecto'); 
    return res.status(403).json({ msg: error.message });
  }
};

//Confirmacion

const confirmar = async (req, res) => {
  const { token } = req.params;
  const usuarioConfirmar = await Usuario.findOne({ token });

  if (!usuarioConfirmar) {
    const error = new Error('Token no valido');
    return res.status(403).json({ msg: error.message });
  }

  try {
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = '';
    await usuarioConfirmar.save();
  
    res.json({
      msg: 'Cuenta confirmada con éxito'
    });
  } catch (error) {
    console.log(error)
  }
}

//Recuperar password
const recuperarPassword = async (req, res) => {
  const { email } = req.body;
    //Comprobar si el usuario existe
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      const error = new Error('El usuario no existe');
      return res.status(404).json({ msg: error.message });
    }

    try {
      usuario.token = generarId();
      await usuario.save();

      //Enviar email de confirmacion
      emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
      });

      res.json({msg:'Hemos enviado un email con las nuevas instrucciones'});
    } catch (error) {
      console.log(error);
    }
}

//Comprobar token
const comprobarToken = async (req, res) => {
  const { token } = req.params;
 
  const tokenValido = await Usuario.findOne({ token });

  if(tokenValido){
    
    res.json({msg:'Token valido. El usuario existe'});

  } else{
    const error = new Error('Token no valido');
    return res.status(404).json({ msg: error.message });
  }
}

//Nuevo password
const nuevoPassword = async (req, res) => {
  const {token} = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ token });
  if(usuario){
    usuario.password = password;
    usuario.token = '';
   try {
    await usuario.save();
    res.json({msg:'Password cambiado con éxito'});
   } catch (error) {
     console.log(error);
   }
  } else {
    const error = new Error('Token no valido');
    return res.status(404).json({ msg: error.message });
  }
}

//Perfil
const perfil = async (req, res) => {
  const {usuario} = req;
  res.json(usuario);

    }


export { registrar, login, confirmar, recuperarPassword,comprobarToken, nuevoPassword, perfil };