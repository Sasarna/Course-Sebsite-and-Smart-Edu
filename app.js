const express = require('express');
const app = express();

const ejs = require('ejs');

const PORT = 3000;

//* Template Engine
app.set('view engine' , 'ejs');

//* Middleware
app.use(express.static('public'));

//* Routes

app.get('/' , (req , res) => {
    res.status(200).render('index' , {
        page_name: "index"
    });
})

app.get('/about' , (req , res) => {
    res.status(200).render('about' , {
        page_name: "about"
    });
});

app.listen(PORT , () => {
    console.log(`App started on port : ${PORT}`);
});
