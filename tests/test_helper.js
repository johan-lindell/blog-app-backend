const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialBlogs = user => { return [
    {
        title: 'testblog1',
        author: 'testerman1',
        url: 'www.testing1.com',
        likes: 1,
        user: user
    },
    {
        title: 'testblog2',
        author: 'testerman2',
        url: 'www.testing2.com',
        likes: 2,
        user: user
    },
    {
        title: 'testblog3',
        author: 'testerman3',
        url: 'www.testing3.com',
        likes: 3,
        user: user
    }
]}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(b => b.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const createUser = (username, password) => {
    return (
    {
        username: username,
        name: 'testing',
        password: password
    })

}
module.exports = {
    initialBlogs,
    blogsInDb,
    usersInDb
}