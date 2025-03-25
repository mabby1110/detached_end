const fs = require('fs');
const path = require('path');

// Datos de ejemplo (los mismos que en REST para consistencia)
let users = [
  { id: 1, name: 'Juan Pérez', email: 'juan@example.com' },
  { id: 2, name: 'María García', email: 'maria@example.com' }
];

// Definición del servicio
const service = {
  UserService: {
    UserPort: {
      // Obtener todos los usuarios
      getUsers: function(args, callback) {
        callback(null, { users: users });
      },
      
      // Obtener usuario por ID
      getUser: function(args, callback) {
        const user = users.find(u => u.id === args.userId);
        if (!user) return callback(new Error('Usuario no encontrado'));
        callback(null, { user: user });
      },
      
      // Crear usuario
      createUser: function(args, callback) {
        const newUser = {
          id: users.length + 1,
          name: args.name,
          email: args.email
        };
        users.push(newUser);
        callback(null, { user: newUser });
      }
    }
  }
};

// Cargar WSDL
const wsdl = fs.readFileSync(path.join(__dirname, 'service.wsdl'), 'utf8');

module.exports = { service, wsdl };