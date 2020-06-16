const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

//show API as a lst of objects in JSON format
blogsRouter.get('/', (request, response, next) => {
    console.log('running blogs router get')
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
      .catch(error => next(error))
  })

//add a blog to MONGODB database
blogsRouter.post('/', (request, response, next) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter