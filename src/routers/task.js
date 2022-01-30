const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')
const { query } = require('express')

router.post('/tasks', auth, async(req,res) => {
    // const task = new Task(req.body)
    const task = new Task({
        // ES6 spread operator that's going to copy all of the properties from body over to this object.
        ...req.body,
        // There's no need to pass the owner ID along with the data you send as part of the request body.
        owner: req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400),send(e)
    }
})


// GET /tasks?completed=false(or true)
// GET /tasks?limit=10&skip=10 (10 results skip the first 10)
// GET /tasks?sortBy=createdAt:asc(desc) 
router.get('/tasks', auth, async (req,res) => {
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true' // if not true, it will be false
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = (parts[1] === 'desc'? -1 : 1)
    }

    try{
        // const tasks = await Task.find({ owner: req.user._id })
        // or
        await req.user.populate({
            // We wanna customize this object, but we want to do it based off of the querystring provided.
            path: 'tasks',
            match,
            options: { // options property can be used for pagination and it can also be used for sorting.
                skip: parseInt(req.query.skip),
                limit: parseInt(req.query.limit),
                sort
                // sort: {
                //     createdAt: - 1, // 1 for ascending, -1 for descending
                // }
            }
        })
        // res.status(200).send(tasks)
        // or
        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth ,async (req,res) => {
    const _id = req.params.id
    
    try{
        const task = await Task.findOne({ _id, owner: req.user._id })
        
        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        res.status(404).send('Invalid update.')
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!task){
            return res.status(404).send()
        }
        
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()

        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id', auth, async(req, res)=>{
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task){
            res.status(404).send()
        }
    
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router