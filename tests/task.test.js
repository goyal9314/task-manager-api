const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
    userOneId,
    userOne,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)
test('Should create task for user', async () => {
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: 'From my test'
    })
    .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should fetch user tasks', async () => {
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
   // const task = await Task.findById(response.body._id)
    expect(response.body.length).toEqual(2)
    //expect(task.completed).toEqual(false)
})

// test('Should not delete other users tasks', async () => {
//     const response = await request(app)
//     .delete(`/tasks/${taskThree._id}`)
//     .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
//     .send()
//     .expect(404)
//     const task = await Task.findById(taskThree._id)
//     //expect(response.body.length).toEqual(2)
//     expect(task).not.toBeNull()
// })
