const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
    
    blogObject = new Blog(helper.initialBlogs[2])
    await blogObject.save()
})

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

test('the unique id is defined', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
    expect(response.body[1].id).toBeDefined()
    expect(response.body[2].id).toBeDefined()
})

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

test('Blog is deleted correctly', async () => {
    const firstResponse = await api.get('/api/blogs')
    const id = firstResponse.body[2].id
    
    await api
        .delete(`/api/blogs/${id}`)
        .expect(204)
    
    const secondResponse = await api.get('/api/blogs')
    expect(secondResponse.body).toHaveLength(firstResponse.body.length - 1)


})



afterAll(() => {
    mongoose.connection.close()
})