const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');

const pageRoute = require('./routes/pageRoutes.js');
const courseRoute = require('./routes/courseRoutes.js');
const categoryRoute = require('./routes/categoryRoutes.js');
const userRoute = require('./routes/userRoutes.js');

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
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//* Routes
app.use('/', pageRoute);
app.use('/courses' , courseRoute);
app.use('/categories' , categoryRoute);
app.use('/users' , userRoute);



app.listen(PORT, () => {
    console.log(`App started on port : ${PORT}`);
});
