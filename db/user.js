const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const validator = require('validator')

mongoose.connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Db server is connected")
}).catch((e) => {
    console.log("there was an unforturnate error")
})


const User = new mongoose.Schema({
    username: {
        type: String,
        required: true
    }, email: {
        type: String,
        unique: true,
        required: true
    }, password: {
        type: String,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error("Password Value cannot be equal to (password)")
            }
        }
    }
})

User.plugin(passportLocalMongoose)
User.plugin(findOrCreate)



module.exports = mongoose.model('User', User)
