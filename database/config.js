const mongoose = require('mongoose');


const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN);
    return("Conectado a la DB")
    
  } catch (error) {
    console.error('Error al iniciar la DB:', error);
    throw new Error('Error al iniciar la DB');
  }
};

module.exports = {
  dbConnection,
};