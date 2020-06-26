const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { request, response } = require('express')

//show API as a lst of objects in JSON format
blogsRouter.get('/', async (request, response) => {
    console.log('running blogs router get')
    const blogs = await Blog.find({})
    response.json(blogs.map(blog => blog.toJSON()))
  }
)

//add a blog to MONGODB
blogsRouter.post('/', async (request, response) => {
  //checking if title or url are missing
  if (!request.body.title && !request.body.url) {

    //if missing 400 Bad request
    response.status(400).end()

  } else {

    //checking if likes is missing
    if (!request.body.likes) {

      //if missing likes = 0
      request.body.likes = 0
    }

    //creates blog and saves to mongoDB
    const blog = new Blog(request.body)
    const savedBlog = await blog.save()

    //responds with created blog
    response.json(savedBlog.toJSON())
  }

  
  
})

//delete blog from MONGODB
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()

})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true} )
  response.json(updatedBlog)
})


module.exports = blogsRouter