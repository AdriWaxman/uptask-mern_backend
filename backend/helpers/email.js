import nodemailer from 'nodemailer';

export const emailRegistro = async (datos) => {

  const { nombre, email, token } = datos;

    const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "2886821046db14",
      pass: "a9f68d210f99f5"
    }
  });


  //Información del email
  const info = await transport.sendMail({
    from: '"Uptask - Administrador de proyectos" <info.cuentas@uptask.com>',
    to: email,
    subject: "Confirmación de registro en Uptask",
    text: "Comprueba tu cuenta en uptask",
    html:`<h4>Hola ${nombre}!</h4>
    <p> Tu cuenta está casi lista, solo falta que confirmes tu correo electrónico. </p>
    <p> Para ello, pulsa en el siguiente enlace: </p>
    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar cuenta</a>
    <p> Si no has solicitado una cuenta en Uptask, ignora este correo. </p>
    `
  });

};

export const emailOlvidePassword = async (datos) => {

  const { nombre, email, token } = datos;

  //ToDo: Mover a .env
    const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "2886821046db14",
      pass: "a9f68d210f99f5"
    }
  });


  //Información del email
  const info = await transport.sendMail({
    from: '"Uptask - Administrador de proyectos" <info.cuentas@uptask.com>',
    to: email,
    subject: "Reestablecer contraseña en Uptask",
    text: "Restablece tu password",
    html:`<h4>Hola ${nombre}!</h4>
    <p> Has solicitado reestablecer tu contraseña </p>
    <p> Para ello, pulsa en el siguiente enlace: </p>
    <a href="${process.env.FRONTEND_URL}/recuperar-password/${token}">Reestablecer contraseña</a>
    <p> Si no has solicitado reestablecer tu contraseña en Uptask, ignora este correo. </p>
    `
  });

};



