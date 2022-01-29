const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async(req, res, next) => {
    try{
        // Bearer, it's just a standard. There are different types of authentication like "Digest" or "Basic" and it's used to identify which one you're dealing with but it's not required.
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token, 'thisismynewcourse')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if(!user){
            throw  new Error()
        }

        // The other thing we're going to do is give that route handler access to the user that we fetched from the database.
        // And there's no need for the root handlers to have to fetch the user again as that would just waste resources
        // We can actually add a property onto request to store this and the route handlers will be able to access it later on.
        req.user = user
        req.token = token

        next()
    }catch(e){
        res.status(401).send({ error: "Please authenticate." })
    }
    // We passed the middleware function in as the second argument and the root handler in as the third.
    // Now, the middleware function itself starts by looking for the header that the user is supposed to provide.
    // It then validates that header and it finds the associated user from there.
    // One of two things happen. Either we call next letting the root handler run or if they're not authenticated, we go ahead and send back an error, letting them know that they're not able to perform the operation that they're trying to perform.
}

module.exports = auth