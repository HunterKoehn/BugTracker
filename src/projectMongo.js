const mongoose = require('mongoose')
require('dotenv').config()


mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI)
// the last part of the above line is the name of the database
.then(() => {
    console.log('projects loaded up');
})
.catch(() => {
    console.log('failed to load projects');
})

const ProjectsSchema = new mongoose.Schema({
    projectTitle: {
        type: String,
        required: true
    },
    projectStatus: {
        type: String,
        required: false
    }
})

const projectList = new mongoose.model('Projects', ProjectsSchema)

module.exports = projectList