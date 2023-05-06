const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()


mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI)
// the last part of the above line is the name of the database
.then(() => {
    console.log('mongodb connected');
})
.catch(() => {
    console.log('failed to connect');
})

const LogInSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

//encrypting password before saving
LogInSchema.pre('save', async function(next) {

    if(!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 8)
});

const collection = new mongoose.model('LogInCollection', LogInSchema)
// const ticket = new mongoose.model('Tickets', TicketSchema)
// part in '' on line above is the collection name

module.exports = collection