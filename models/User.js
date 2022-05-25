import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const usuarioSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  token: {
    type: String,
  },
  confirmado: {
    type: Boolean,
    default: false
  },

},{
  timestamps: true
})

usuarioSchema.pre('save', async function(next) { //pre es un hook que se ejecuta antes de guardar un usuario en la base de datos, usamos function para usar this
  if(!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

});

usuarioSchema.methods.comprobarPassword = async function(passwordForm) {
  return await bcrypt.compare(passwordForm, this.password);
}

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;