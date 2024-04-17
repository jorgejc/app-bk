const express = require('express')
const { getConnection } = require('./db/db-connect-mongo');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

// implementamos cors
app.use(cors());


getConnection();


//Parseo JSON
app.use(express.json());

app.use('/usuario', require('./router/usuario'));
app.use('/marca', require('./router/marca'));
app.use('/estado-equipo', require('./router/estadoEquipo'));
app.use('/tipo-equipo', require('./router/tipoEquipo'));
app.use('/inventario', require('./router/inventario'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  