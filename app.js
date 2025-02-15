const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const pageRoute = require("./routes/pageRoutes.js");
const courseRoute = require("./routes/courseRoutes.js");
const categoryRoute = require("./routes/categoryRoutes.js");
const userRoute = require("./routes/userRoutes.js");

const app = express();

const PORT = 3100;

//* Connect DB
mongoose.connect("mongodb://localhost/smartedu_db")
    .then(() => {
        console.log("MongoDB database connection completed!");
    })
    .catch((err) => {
        console.error(err);
    });

//* Template Engine
app.set("view engine", "ejs");

//* Global Variables
global.userIN = null;

/*

// Middleware
app.use('*', (req, res, next) => {
  req.userIN = req.session.userID; // Kullanıcı bilgisini req nesnesine ekle
  next();
});

// Başka bir route
app.get('/profil', (req, res) => {
  const userId = req.userIN; // Kullanıcı bilgisine req.userIN ile eriş
  if (userId) {
    // Kullanıcı oturum açmış, profil sayfasını göster
    res.render('profil', { userId: userId });
  } else {
    // Kullanıcı oturum açmamış, giriş sayfasına yönlendir
    res.redirect('/giris');
  }
});

*/

//* Middleware
app.use(express.static("public"));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(session({
        secret: "my_keyboard_cat",
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: "mongodb://localhost/smartedu_db" }),
    })
);

//* Routes
app.use("*", (req, res, next) => {
    userIN = req.session.userID;
    next();
});
app.use("/", pageRoute);
app.use("/courses", courseRoute);
app.use("/categories", categoryRoute);
app.use("/users", userRoute);

app.listen(PORT, () => {
    console.log(`App started on port : ${PORT}`);
});
