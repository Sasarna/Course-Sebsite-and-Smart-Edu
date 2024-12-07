const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');

const pageRoute = require('./routes/pageRoutes.js');
const courseRoute = require('./routes/courseRoutes.js');

const app = express();

const PORT = 3000;

//* Connect DB
mongoose.connect('mongodb://localhost/smartedu_db')
    .then(() => {
        console.log('MongoDB database connection completed!');
    }).catch((err) => {
        console.error(err);
    });

//* Template Engine
app.set('view engine', 'ejs');

//* Middleware
app.use(express.static('public'));

//* Routes
app.use('/', pageRoute);
app.use('/course' , courseRoute);

app.listen(PORT, () => {
    console.log(`App started on port : ${PORT}`);
});
