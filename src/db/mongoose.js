const mongoose = require('mongoose')

// mongoose will automatically create a database for us if the database is not exist
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true
})




// const task = Task({
//     description: 'Learn the Mongoose library',
//     completed: false
// })

// task.save().then(()=>{
//     console.log(task)
// }).catch((error)=>{
//     console.log(error)
// })