const express = require('express')
require('./db/mongoose')
const body = require('body-parser')
const path =require('path')
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');

const userRoute = require('./routers/user')
const taskRoute = require('./routers/task')
const patinetRoute = require('./routers/Patient')
const app = express()

app.use(express.json())
// app.use(body.json)
// app.use(methodOverride('_method'))
// app.set('view engine', 'ejs')
app.use(userRoute)
app.use(taskRoute)
app.use(patinetRoute)

//without middleware: new request -> run route handler
//with middleware: new request -> do something -> run route handler

const upload = multer({
    dest : 'images'
})
app.post('/uploadfile', upload.single('file'), (req,res) =>{
    res.send();
})


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
module.exports = app