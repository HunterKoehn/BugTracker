const express = require('express')
const app = express()
const path = require('path')
const ejs = require('ejs')
const collection = require('./mongodb')
const ticket = require('./ticketMongo')
const projectList = require('./projectMongo')
const { link } = require('fs')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
dotenv.config()
const templatePath = path.join(__dirname, '../templates')

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/stylesheets'))
app.use(express.json())
app.set('view engine', 'ejs')
app.set('views', templatePath)
app.use(express.urlencoded({extended:false}))

app.get('/', (req, res) => {
  res.render('login.ejs')
})

app.get('/signup', (req, res) => {
  res.render('signup.ejs')
})

app.post('/signup', async(req, res) => {

  const { firstName, lastName, username, email, password } = req.body
  const hash = await bcrypt.hash(password, 8)

  const newData = {
    firstName,
    lastName,
    username,
    email,
    password: hash
  }

await collection.insertMany([newData])

res.render('login.ejs')

})

app.get('/home', async (req, res) => {
  const lowCount = await ticket.countDocuments({ Priority: 'Low' })
  const mediumCount = await ticket.countDocuments({ Priority: 'Medium' })
  const highCount = await ticket.countDocuments({ Priority: 'High' })

  res.render('home.ejs', { ticketsLow: lowCount, ticketsMedium: mediumCount, ticketsHigh: highCount })
})

var currentLogger = {};

app.post('/home', async(req, res) => {

try {
  const check = await collection.findOne({username: req.body.username})
  
  const isValid = await bcrypt.compare (
    req.body.password,
    check.password
  )
  
  if(isValid) {
    const lowCount = await ticket.countDocuments({ Priority: 'Low' })
    const mediumCount = await ticket.countDocuments({ Priority: 'Medium' })
    const highCount = await ticket.countDocuments({ Priority: 'High' })
    res.render('home.ejs', { ticketsLow: lowCount, ticketsMedium: mediumCount, ticketsHigh: highCount })
  }
  else {
    res.send('Wrong password')
  }
}
catch(e) {
  console.error(e)
  res.send('Oops! Something went wrong!')
}
})

app.get('/projectsPage', async(req, res) => {
  await projectList.find({})
  .then(data => {
    res.render('projectsPage.ejs', { projects: data })
  })
  .catch(error => console.error(error))
})

app.post('/projectsPage', async(req, res) => {

  const { projectTitle, projectStatus } = req.body

  let newProject = {
    projectTitle,
    projectStatus
  }


  try {
   await projectList.insertMany([newProject])
   await projectList.find({})
   .then(data => {
     res.render('projectsPage.ejs', { projects: data })
   })
   }
  catch(e) {
    res.render('goBackProjects.ejs')
    console.log(e);
  }
  
})

app.get('/tickets', async(req, res) => {
  await ticket.find({})
  .then(data => {
    res.render('tickets.ejs', { items: data })
  })
  .catch(error => console.error(error))
})

app.get('/viewUsers', async(req, res) => {
  await collection.find({})
  .then(data => {
    res.render('viewUsers.ejs', { users: data })
  })
  .catch(error => console.error(error))
})

app.post('/tickets', async(req, res) => {

  function generateTicketNumber(){
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZ";
    let nums = "0123456789";
    let string_length = 3;
    let number_length = 2;
    let randomstring = '';
    let randomnumber = '';
    for (let i=0; i<string_length; i++) {
        let rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);

    }
    for (let i=0; i<number_length; i++) {
        let r = Math.floor(Math.random() * nums.length);
        randomnumber += nums.substring(r,r+1);

    }
        return  (randomstring + randomnumber);

}

  let Key = generateTicketNumber();
  const { Title, Project, DevAssigned, Priority, Type, Status, Desc, Date } = req.body

  let newTicket = {
    Key,
    Title,
    Project,
    DevAssigned,
    Priority,
    Status,
    Type,
    Desc,
    Date
  }


  try {
   await ticket.insertMany([newTicket])
   await ticket.find({})
   .then(data => {
     res.render('tickets.ejs', { items: data })
   })
   }
  catch(e) {
    res.render('goBack.ejs')
    console.log(e);
  }
  
})

app.get('/profile', async (req, res) => {
  res.render('profile.ejs')
})

app.listen(3000, () => {
  console.log('port is running, betta go catch it!')
})