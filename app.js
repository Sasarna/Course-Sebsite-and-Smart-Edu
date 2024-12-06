const express = require('express');
const pageRoute = require('./routes/pageRoutes');

const app = express();

const ejs = require('ejs');

const PORT = 3000;

//* Template Engine
app.set('view engine' , 'ejs');

//* Middleware
app.use(express.static('public'));

//* Routes
app.use('/' , pageRoute);

app.listen(PORT , () => {
    console.log(`App started on port : ${PORT}`);
});
