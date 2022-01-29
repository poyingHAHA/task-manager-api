require('../src/db/mongoose') // database connection
const User = require('../src/models/user')

// 61f0df07d04381b6d301bab1

// User.findByIdAndUpdate('61f0e3fc2c860bbfb2d732db', { age: 1 }).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 1 })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const updateAgeAndCount = async(id, age)=>{
    const user = await User.findByIdAndUpdate(id, {age: age})
    const count = await User.countDocuments({ age })
    return count
}

updateAgeAndCount('61f0e3fc2c860bbfb2d732db', 2).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})