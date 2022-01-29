const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

// In order to take advantage of the middleware functionality, all we hace to do is create the schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        lowercase: true,
        type: String,
        // One of the basic things you should set up when creating a login system is a restriction on the email.
        // If a user already has an account registered with a specific email, another user shpuld not be able to come along and use that same email
        // In order to get this to work, we have to wipe the database and have it get recreated so the index can be setup.
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value){ // Customize own validation
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password cannot contain password')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer //THis is going to allow us to store the buffer with our binary image data right in the database.
    }
}, {
    timestamps: true
})

// It's virtual because we're not actually changing what we store for the user document.
// It's just a way for mongoose to figure out how these two things are related.
userSchema.virtual('tasks', {
    ref: 'Task', // This is not store in the database, it's just for mongoose to be able to figure out who owns what and how they're related.
    localField: '_id',
    foreignField: 'owner' // The foreign fiel is the name of the field on the other thing, in this case, on the task that's going to create this relationship and we set that up to be the owner. The localfield is where the local data is stored.
}) 

// Hiding private data which user does't need to access
userSchema.methods.getPublicProfile = function(){
    const user = this // this just make our function more readable
    const userObject = user.toObject() // this is going to give us raw profile data.

    delete userObject.password
    delete userObject.tokens

    return userObject
}

// What's so special about 'toJSON' that allows it to run, even though we're never explicitly calling this.
userSchema.methods.toJSON = function(){
    const user = this // this just make our function more readable
    const userObject = user.toObject() // this is going to give us raw profile data.

    delete userObject.password
    delete userObject.tokens
    // we have set up url that can serve image up, So there's no need to send it backwith profile requests because the data is large
    delete userObject.avatar

    return userObject
}

// statics function can be use anywhere from the User.function while methods can only be used after an instance of a User.
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}


// By setting up a value on userSchema.static, we're setting that up as something we can access diectly on the model once we actually have access to it
userSchema.statics.findByCredentials = async (email, password) => {
    // Now it's our job to attempt to find the user by those pieces of information.
    // We want to start by finding them by email. We can't find them by email and the password because we have the plaintext password and it's hash password in the db.
    const user = await User.findOne({ email })
    if(!user){
        throw new Error('Unable to login')
    }
    
    const isMatch = await bcrypt.compare(password, user.password)
    
    if(!isMatch){
        // It's best not be too specific
        throw new Error('Unable to login')
    }
    
    return user
} 

// We have pre for doing something before an event like before validation or before saving.
// .post for doing something just after an event, such as after the user has been saved.
// When we use pre we pass to it two arguments. The first is the name of the event that would be save in our case and 
// the second is the function to run, This need to be a standard function, not an arroe function, because the 'this binding' plays an important role. 
userSchema.pre('save', async function(next){
    // this which is equal to the document being saved
    const user = this
    
    // Hash password when user has a modified password property
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    
    // The point of pre is to run some code before a user is saved. But how does it know we're done running our code.
    // It could just say when the function is over, but that wouldn't account for any asynchronous process which might be occurring.
    // That's why next is provided, we simply call next when we're done.
    // If we never call next, it's just going to hang forever, thinking that we're still running some code.
    next()
})

// Delete user tasks when user is removed
userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({ owner: user._id })    
    next()
})

// When we pass an object in as that second argument behind the scenes, Mongoose converts it into a schema.
// When we create a schema separately, we have access to the userSchema and we're going to do is pass that in as the second argument to model.
const User = mongoose.model('User', userSchema)

module.exports = User

// const me = new User({
//     name: '  Edwin  ',
//     email: ' poying@gmail.com',
//     password: 'dasjdlksaj'
// })
// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log('Error! ', error)
// })
