const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId, userOne, setupDatabase} = require('./fixtures/db')

//This function provided by jest runs before each test cas in this test suite
// beforeEach( async () => {
//     // await User.deleteMany()  //  make sure the users are gone, then go to the test unit
//     // await new User(userOne).save()
// })

beforeEach(setupDatabase)

// afterEach(() => {
//     console.log('afterEach')
// })

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Andrew',
        email: 'edwin@example.com',
        password: 'aq4478959'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body.user.name).toBe('Andrew')
    expect(response.body).toMatchObject({
        user:{
            name: 'Andrew',
            email: 'edwin@example.com',
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('aq4478959')
})

// Goal: Validate new token is SVGAnimatedEnumeration
// 1. Fetch the user from the database
// 2. Assert that token in response matches users second token
// 3. the reason for second token is that we will create new token when we login
test('Should login existing user', async() => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('should not login nonexistent user', async()=>{
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'sdasdasdas'
    }).expect(400)
})

// tell supertest we want to set the authorization header. 
test('Should get profile for user', async()=>{
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async() => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async ()=>{
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async ()=>{
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('SHould upload avatar image', async()=>{
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('uploads', 'tests/fixtures/profile-pic.jpg')  
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer)) // toBe() use === but {}!=={}, so use toEqual()
})

// updata the name of the test user
// check the data to confirm it's changed
test('Should update valid user fields', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Jess'
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Jess')
})

test('Should not update invalid user fields', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Jazz'
        })
        .expect(400)
})