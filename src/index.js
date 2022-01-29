const express = require('express')
require('./db/mongoose') //By requiring this file that is going to ensure that the file runs and it's going to ensure that mongoose connects to the database.
// const User = require('./models/user')
// const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

// // file upload
// // Multer is short for multipart and this comes from the type of data that multer allows tour application to accept
// // When it comes to file uploads, we're no longer going to send a JSON body, instead, we'll be using form-data
// const multer = require('multer')
// const upload = multer({
//     // The name of the folder where all of the uploads should be stored.
//     dest: 'images',
//     limits: {
//         fileSize: 1000000  // 1 mega bytes
//     },
//     // This is going to called internally by Multer and it's going to provide us with three arguments.
//     fileFilter(req, file, cb){
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('Please upload a Word document'))
//         }
//         //  if(!file.originalname.endsWith('.pdf')){
//         //     return cb(new Error('Please upload a PDF'))
//         //  }

//          cb(undefined, true)
//         // cb(new Error('File must be xxx')) // This is how we can send back an error to the person who uploaded the file.
//         // cb(undefined, true) // If things go well.
//         // cb(undefined, false) // THis is going to silently reject the upload.
//     }
// })

// const errorMiddleware = (req, res, next) => {
//     throw new Error('From my middleware')
// }

// app.post('/upload', errorMiddleware, (req,res) => {
//     res.send()
// }, (error, req, res, next) => { // It's important to provide all four arguments, so Express knows that this function is designed to handle errrs
//     // next() is not used to stop execution, it's used to tell the current middleware that it's done and it should move onto the next middleware. However, if one of your middleware functions throws an error, Express will skip the the next middleware that accepts an error argument and execute that one.
//     res.status(400).send({ error: error.message })
// })
// app.post('/upload', upload.single('upload'), (req,res) => {
//     res.send()
// }, (error, req, res, next) => { // It's important to provide all four arguments, so Express knows that this function is designed to handle errrs
//     res.status(400).send({ error: error.message })
// })

//
// Without middleware: new request -> run route handler
//
// With middleware: new request -> do something -> run route handler
//

// app.use((req, res, next) => {
//     res.status(503).send('Server is temporarily unavailable')
// })

// app.use((req, res, next) => {
//     // console.log(req.method, req.path)    
//     if(req.method === 'GET'){
//         res.send('GET requests are disabled')
//     }else{
//         next()
//     }
//     // 'next' is called to signal to Express that the middleware function is done
//     next()
// })

// When we set up this one line, it's going to automatically pass incoming JSON to an object so we can access it in our request.
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port '+port)
})

// reference database demo
// const Task = require('./models/task')
// const User = require('./models/user')
// const main = async () => {
//     // const task = await Task.findById('61f298f616ae078eb012286d')
//     // // Populate allows us to populate data from a relationship such as the data we have right here for owner.
//     // // we pass to populate the thing we're trying to populate(owner)
//     // await task.populate('owner')
//     // console.log(task.owner)

//     const user = await User.findById('61f296b0de48e38b187c03d6')
//     await user.populate('tasks')
//     console.log(user.tasks)
// }

// main()
































// app.post('/users', async (req, res) => {
//     const user = new User(req.body)

//     try{
//         await user.save()
//         res.status(201).send(user)
//     }catch(e){
//         res.status(400).send(e)
//     }

//     // // user.save() will return a Promise which we can do .then and .catch.
//     // user.save().then(() => {
//     //     res.status(201).send(user)
//     // }).catch((error) => {
//     //     // res.status(400) // .status should be called before res.send
//     //     // res.send(error)
//     //     //or
//     //     res.status(400).send(error)
//     // })
// })

// app.get('/users', async (req,res) => {
//     try{
//         const users = await User.find({})
//         res.send(users)
//     }catch(e){
//         res.status(500).send()
//     }   

//     // This is going to fetch al users stored in the database.
//     // User.find({}).then((users) => {
//     //     res.send(users)
//     // }).catch((e) => {
//     //     res.status(500).send()
//     // })
// })

// app.get('/users/:id', async (req, res) => {
//     const _id = req.params.id
    
//     try{
//         const user = await User.findById(_id)
//         if(!user){
//             return res.status(404).send()
//         }

//         res.send(user)
//     }catch(e){
//         res.status(500).send()
//     }

//     // // mongoose will automatically convert string id to objectID when using findById
//     // User.findById(_id).then((user) => {
//     //     if(!user){
//     //         return res.status(404).send()
//     //     }

//     //     res.send(user)
//     // }).catch((err) => {
//     //     res.status(500).send()
//     // })
// })

// // update user by id
// app.patch('/users/:id', async(req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every((update) => {
//         // The callback function get called for every item in the array.
//         return allowedUpdates.includes(update)
//     })

//     if(!isValidOperation){
//         res.status(400).send({error: 'Invalid updates!'})
//     }

//     try{
//         // 'new: true' is going to return the new user as opposed to the existing one that was found before the update.
//         const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        
//         if(!user){
//             return res.status(404).send()
//         }

//         res.send(user)
//     }catch(e){
//         res.status(400).send(e)
//     }
// })

// app.delete('/users/:id', async (req, res)=>{
//     try {
//         const user = await User.findByIdAndDelete(req.params.id)

//         if(!user){
//             return res.status(404).send()
//         }

//         res.send(user)
//     } catch (error){
//         res.status(500).send()
//     }
// })

