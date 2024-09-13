const express = require('express');
const { body, validationResult } = require('express-validator');
const app = express();
const cors = require('cors')
const port = 8000;

// Connect to database
const knex = require('knex')({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    // host: 'localhost',
    // port: '5432',
    // user: 'postgres',
    // password: 'password123',
    // database: 'form_register',
    // ssl: false,
  },
});

app.use(express.json());
app.use(cors());

// Ruta para registrar usuario
app.post('/register', [
  // Validación de los campos del formulario
  body('name').notEmpty().withMessage('El nombre es requerido.'),
  body('last_name').notEmpty().withMessage('El apellido es requerido.'),
  body('email').notEmpty().isEmail().withMessage('El correo electrónico es requerido y debe ser válido.'),
  body('password').notEmpty().withMessage('La contraseña es requerida.'),
  body('country').notEmpty().isIn(['Guatemala', 'Mexico', 'USA']).withMessage('Debe seleccionar un país válido.'),
  body('genre').notEmpty().isIn(['Masculino', 'Femenino']).withMessage('Debe seleccionar un género válido.'),
  body('accept_terms').custom(value => {
    // Validar que accept_terms sea booleano
    if (value === 'on' || value === true || value === 'true') return true;
    return false;
  }).withMessage('Debes aceptar los términos y condiciones.')

  
], async (req, res) => {
  // Validar la información recibida
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Guardar la información en la base de datos
  try {
    console.log('Storing new form info in the database');
    await knex('users').insert({
      name: req.body.name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      country: req.body.country,
      genre: req.body.genre,
      accept_terms: req.body.accept_terms === 'on' ? true : req.body.accept_terms
    });
    console.log('Info stored successfully');
    return res.status(201).json({ msg: 'Info stored successfully' });
  } catch (e) {
    console.error('Something went wrong trying to store the info');
    console.error(e);
    return res.status(500).json({ msg: 'Internal Server Error. Please contact "al inge".' });
  }
});



// Función para crear tablas si no existen
const createTables = async () => {
  console.log('Verifying tables at the database');
  knex.schema.hasTable('users').then(async function (exists) {
    if (!exists) {
      console.log('Creating tables at the database');
      return await knex.schema.createTable('users', (table) => {
        table.increments('id');
        table.string('name');
        table.string('last_name');
        table.string('email');
        table.string('password');
        table.string('country');
        table.string('genre');
        table.boolean('accept_terms');
      });
    }
  });

  console.log('Tables were created/verified successfully');
};

// Ruta para obtener todos los usuarios
app.get('/users', async (req, res) => {
  try {
    const users = await knex('users').select('*');
    return res.status(200).json(users);
  } catch (e) {
    console.error('Error retrieving users');
    console.error(e);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
});


// Iniciar el servidor
app.listen(port, async () => {
  await createTables();
  console.log(`Form Register API listening on port ${port}`);
});



