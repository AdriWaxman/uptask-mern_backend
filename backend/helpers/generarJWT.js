import jwt from 'jsonwebtoken';

const generarJWT = (id) => {
  // const payload = {
  //   usuarioId: usuario._id,
  //   email: usuario.email,
  //   nombre: usuario.nombre,
  // };

  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

export default generarJWT;