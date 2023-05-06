const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI)

const TicketSchema = new mongoose.Schema({
    Key: {
        type: String,
        required: false
    },
    Title: {
        type: String,
        required: true
    },
    Project: {
        type: String,
        required: true
    },
    DevAssigned: {
        type: String,
        required: true
    },
    Priority: {
        type: String,
        required: true
    },
    Type: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        required: true
    },
    Desc: {
        type: String,
        required: true
    },
    Date: {
        type: String,
        required: true
    }
})

const ticket = new mongoose.model('Tickets', TicketSchema)
// part in '' on line above is the collection name

module.exports = ticket