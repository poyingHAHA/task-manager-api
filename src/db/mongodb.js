// CRUD create read update delete

// const mongodb = require('mongodb')
// const ObjectID = mongodb.ObjectId
// Initialize the connection
// const MongoClient = mongodb.MongoClient
const {ObjectId, MongoClient} = require('mongodb')
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// const id = new ObjectId()
// console.log(id.id.length)
// console.log(id.toHexString().length)
// console.log(id.getTimestamp())

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    // If the first arg exists, that means things went wrong and it'll contain an error message.
    // The second arg exists, that means things went well and you're connected to the server and you can start tomanipulate your database inside of the callback function
    if(error){
        return console.log('Unable to connect to database!')
    }

    const db = client.db(databaseName)
    
    // const updatePromise = db.collection('users').updateOne({
    //     _id: new ObjectId('61f0089a18edc0b93f8526ec'),
    // },{
    //     $inc: {
    //         age: -3
    //     }
    // })
    
    // updatePromise.then((result) => {
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    db.collection('tasks').updateMany({
        completed: false
    }, {
        $set: {
            completed: true
        }
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })
})
