require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('61f10fe8bc92601f96e0d028').then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed: false })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })


//61f10b7be976a577fa0c2b27
const deleteTaskAndCount = async (id)=>{
    await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed: false})
    return count
}

deleteTaskAndCount('61f10b7be976a577fa0c2b27').then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(error)
})

