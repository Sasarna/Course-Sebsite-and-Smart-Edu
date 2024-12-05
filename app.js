const express = require('express');
const app = express();

const PORT = 3000;

app.get('/' , (req , res) => {
    res.status(200).send('İndex sayfası')
})

app.listen(PORT , () => {
    console.log(`App started on port : ${PORT}`);
});
