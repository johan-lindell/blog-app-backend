const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'testblog1',
        author: 'testerman1',
        url: 'www.testing1.com',
        likes: 1
    },
    {
        title: 'testblog2',
        author: 'testerman2',
        url: 'www.testing2.com',
        likes: 2
    },
    {
        title: 'testblog3',
        author: 'testerman3',
        url: 'www.testing3.com',
        likes: 3
    }
]

module.exports = {
    initialBlogs
}