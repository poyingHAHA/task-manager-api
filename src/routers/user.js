const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const multer = require('multer')
const sharp = require('sharp') // It's really great for resizing and converting format of image
const {sendWelcomeEmail, sendCancelEmail} = require('../emails/account')

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try{
        const token = await user.generateAuthToken()

        await user.save()
        sendWelcomeEmail(user.email, user.name)  // we don't need await because there is no need to make sure that this completes befre they get their status code back.
        res.status(201).send({user, token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/signup', async (req,res) => {
    const user = new User(req.body)
    try{
        const token = await user.generateAuthToken()

        await user.save()
        res.send({user, token})
    }catch(error){
        res.status(400).send(error)
    }
})

router.post('/users/login', async(req,res) => {
    try { 
        // One of the basic things you should set up when creating a login system is a restriction on the email.
        // If a user already has an account registered with a specific email, another user shpuld not be able to come along and use that same email
        const user = await User.findByCredentials(req.body.email, req.body.password)
        
        // We're going to create a function that returns the token and that token will get sent to the user, will modify the send call below in just a second.
        const token = await user.generateAuthToken()

        // res.send({ user: user.getPublicProfile(), token }) // shoethand syntax
        // or
        res.send({ user, token })
    } catch (error) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res)=>{
    // Remember, if I have five different sessions where I'm logged in such as for my personal computer, my phone or my work computer
    // And I log out out of one , I don't want to log out of everything. So I want to target these specific token that was used when they authenticated right here
    try {
        // Now, the nice thing here is that since we were authenticated, we already have access to the user data.
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req,res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

// When someone makes a get request to forward /users, it's first going to run our middleware. then it'll go ahead and run the route handler
router.get('/users/me', auth, async (req,res) => {
    res.send(req.user) // auth, the middleware, has already fetch the user we want, so we just use it
})


router.patch('/users/me', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => {
        // The callback function get called for every item in the array.
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        res.status(400).send({error: 'Invalid updates!'})
    }

    try{
        // // 'new: true' is going to return the new user as opposed to the existing one that was found before the update.
        // // The findByIdAndUpdate method bypasses mongoose. It performs a direct operation on the database. That's why we even had to set a special option for running the validators.
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        
        // We can go ahead and ddo it the more traditional mongoose way to make sure that our middleware runs correctly.
        // const user = await User.findById(req.params.id)
        const user = req.user

        updates.forEach((update) => {
            user[update] = req.body[update]
        })
        await user.save() //This is where our middleware is actually ging to executed.

        // if(!user){
        //     return res.status(404).send()
        // } 
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

// Even if tou're authenticated, we don't want you to be able to provide the ID of the user to remove.
// Instead , we're going to remove you. You should not to be able to provide the ID of another user to delete them. /:id -> /me
router.delete('/users/me', auth, async (req, res)=>{
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        
        // if(!user){
        //     return res.status(404).send()
        // }
    
        await req.user.remove()
        sendCancelEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (error){
        res.status(500).send(error)
    }
})

const upload = multer({
    // dest: 'avatars', //The multer library is no ;onger going to save images to the avatar directory. Instead, it's going to pass that data through to our function so we can do something with it.
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload jpg、jpeg、png file'))
        }

        cb(undefined, true) // Remember to return this callback when you get the file you want
    }
})

router.post('/users/me/avatar', auth, upload.single('uploads'), async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer() // Convert to the buffer that we can access
    req.user.avatar = buffer // This is an object which contains all of the properties we explored before the file and we're going to use .buffer. Buffer contains a buffer of all of the binar data for that file.
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

// Get the avatar(Picture) for a user by their ID
router.get('/users/:id/avatar', async (req, res)=>{
    try {
        const user = await User.findById(req.params.id)
        
        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})

module.exports = router