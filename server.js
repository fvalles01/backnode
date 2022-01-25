const http = require('http');
// const app = require('./app');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require ('path');
const dotenv = require('dotenv').config();

// const productRoutes = require('./routes/product');
// const userRoutes = require('./routes/user');
const cors = require("cors");


const app = express();

var corsOptions = {
    origin: "http://localhost:8080"
  };
  
  app.use(cors(corsOptions));


const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)){
        return val;
    }
    if(port >= 0) {
        return port;
    }
    return false;
};
// normalizePort : renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne 
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// errorHandler  recherche les différentes erreurs et les gère de manière appropriée.
//  Elle est ensuite enregistrée dans le serveur
const errorHandler = error => {
    if(error.syscall !== 'listen'){
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' rquires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind+ ' is already in use.');
            process.exit(1);
            break;
            default:
                throw error;
    }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port: ' + port;
    console.log('Lisntening on ' + bind);
});
server.listen(port);

const db = require("./models");
const Role = db.role;


db.mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true})

  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

// app.use('/api/product', productRoutes);
// app.use('/api/auth', userRoutes);

// routes
// require('./routes/products.routes')(app);
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/email.routes')(app);
require('./routes/product.routes')(app);
