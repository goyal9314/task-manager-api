const express = require('express')
require('./db/mongoose')
const User = require('./models/user')


const Task = require('./models/task')
const userRoute = require('./routers/user')
const taskRoute = require('./routers/task')

const bcrypt = require('bcryptjs')

const app = express()
const port = process.env.PORT


const multer = require('multer')
const upload = multer({
    dest: 'images'
})
app.post('/upload',upload.single('upload'), (req, res) => {
    res.send()
})
app.use(express.json())
app.use(userRoute)
app.use(taskRoute)

//without middleware: new request -> run route handler
//with middleware: new request -> do something -> run route handler

app.listen(port, () => {
    console.log('Server is up on port'+port)

})

const Task2 = require('./models/task')
const User2 = require('./models/user')
// const main = async () => {
//     //with task finding user
//     // const task = await Task2.findById('5e7f15abe0a0ef2d3c4c5e89')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)

//     //with user finding task
//     const user = await User2.findById('5e7e280b8a41213378b30fb0')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)

// }
// main()