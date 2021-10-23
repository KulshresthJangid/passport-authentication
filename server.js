require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const ejs = require('ejs')

const User = require('./db/user');
const userRoutes = require('./routes/routes');
const { addListener } = require('./db/user');

const app = express();


app.set('view engine', 'ejs')




app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}))

app.use(passport.initialize())
app.use(passport.session())



passport.use(User.createStrategy()) // if things dont work change the User to userSchema

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(userRoutes)

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
});
