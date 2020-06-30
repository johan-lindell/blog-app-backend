const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const { request } = require('../app')
const usersRouter = require('../controllers/users')

beforeEach(async () => {
    await Blog.deleteMany({})
    
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
    
    blogObject = new Blog(helper.initialBlogs[2])
    await blogObject.save()
})

describe('creating a blog', () => {
    

    test('a new valid blog can be added', async () => {
        const newBlog = {
            title: "created blog",
            author: "author",
            url: "url",
            likes: 4
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
    
        const title = response.body.map(r => r.title)
        const author = response.body.map(r => r.author)
        const url = response.body.map(r => r.url)
        const likes = response.body.map(r => r.likes)
    
        expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
        expect(title).toContain("created blog")
        expect(author).toContain("author")
        expect(url).toContain("url")
        expect(likes).toContain(4)
    })

    test('if likes property is missing it is set to 0', async () => {
    
        const newBlog = {
            title: "likes is missing",
            author: "author",
            url: "url"
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
    
        const response = await api.get('/api/blogs')
    
        expect(response.body[3].likes).toBe(0)
    })

    test('If title and url are missing responds with 400', async () => {

        const newBlog = {
            author: "author"
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    
    })


})

describe('deleting blogs', () => {

    test('Blog is deleted correctly', async () => {
        const firstResponse = await api.get('/api/blogs')
        const id = firstResponse.body[2].id
        
        await api
            .delete(`/api/blogs/${id}`)
            .expect(204)
        
        const secondResponse = await api.get('/api/blogs')
        expect(secondResponse.body).toHaveLength(firstResponse.body.length - 1)
    
    
    })

})

describe('returning blogs', () => {

    test('the correct amount of blogs are returned', async () => {
        const response = await api.get('/api/blogs')
    
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('the returned blogs are in JSON format', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
    })

})

describe('when there is initialy one user', () => {
    
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({username: 'root', passwordHash})

        await user.save()
    })

    test('creation succeeds with fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'test123',
            name: 'testing man',
            password: 'testingpass'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('username and password is too short, returns error', async () => {
        
        const newUser = new User({
            username: 'testing',
            name:'testing',
            password: '12'
        })

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })

    test('username and password do not exist, returns error', async () => {
        
        const newUser = new User({
            name:'testing'
        })

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })
    

})

afterAll(() => {
    mongoose.connection.close()
})