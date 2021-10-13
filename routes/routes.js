require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const path = require('path')
const bodyParser = require('body-parser')
const ejs = require('ejs')

const User = require('../db/user')
const auth = require('../middleware/auth')


const router = express.Router()
const app = express()




app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/dashboard', auth, (req, res) => {
    res.send(`Hello ${req.user.username}. your session ID ${req.sessionID}
    and your session expires in ${req.session.cookie.maxAge}
    milliseconds.<br><br>
    <a href="/logout">Log Out</a><br><br>
    <a href="/secret">Members Only</a>`)
})

router.get('/secret', auth, (req, res) => {
    res.render('secret')
})


router.get('/logout', (req, res) =>{
    req.logout()
    res.redirect('/login')
})

router.post('/register',async (req, res) => {
        var newUser = new User({
            username: req.body.name,
            email: req.body.email
        })
    
        await User.register(newUser, req.body.password, function (err, user) {
            if (err) {
                console.log(err)
                res.status(400).send(err.message)
            }
            passport.authenticate('local')(req, res, function () {
                res.redirect('/dashboard')
            })
        })
})

router.post('/login', passport.authenticate('local', {failureRedirect: '/'}),
    function (err, req, res) {
        console.log(req.user)
        res.redirect('/dashboard')
    }
)

module.exports = router