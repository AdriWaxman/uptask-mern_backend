import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from '././config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';
const app = express();

app.use(express.json());

dotenv.config();
db();

//CORS
const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.includes(origin) ) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}
app.use(cors(corsOptions));

 
//<-----Routing------>

// app.use('/', (req, res) => {
//     res.send('Hello World');
// }); // => Responde a todos los request

// app.get('/', (req, res) => {
//     //res.send('Hello World');
//     res.json({msg: 'Hello World'});
// });

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/tareas', tareaRoutes);

const PORT = process.env.PORT || 4000;

const servidor = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//Socket.io
import { Server } from 'socket.io';

const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL,
    },
});

io.on("connection", (socket) => {
    // socket.on("connect_error", (err) => {
    //     console.log(`connect_error due to ${err.message}`);
    //   });
    //console.log("conectado a Socket.io");

    //Definir eventos de socket.io
   socket.on('abrir proyecto', (proyecto) =>{
        //  console.log('abrir proyecto', proyecto );
         socket.join(proyecto);
   });
   
   socket.on('nueva-tarea', (tarea) =>{
       //console.log('nueva-tarea', tarea );
       
       socket.to(tarea.proyecto).emit('tarea-agregada', tarea);
   });

   socket.on('eliminar-tarea', tarea => {
        socket.to(tarea.proyecto).emit('tarea-eliminada', tarea);
   })

   socket.on('actualizar-tarea', tarea => {
       socket.to(tarea.proyecto._id).emit('tarea-actualizada', tarea);
   })

   socket.on('cambiar-estado', tarea=>{
       socket.to(tarea.proyecto._id).emit('estado-actualizado', tarea);
   })

})