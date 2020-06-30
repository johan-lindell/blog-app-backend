const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { request } = require('../app')
const { response } = require('express')

//create a new user
usersRouter.post('/', async (request, response) => {
    const body = request.body

    //checking if password is valid
    if (!body.password || body.password.length < 3) throw Error('InvalidPassword')

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
})

//display users
usersRouter.get('/', async(request, response) => {
    const users = await User
        .find({}).populate('blogs', { url: 1, title: 1, author: 1})
    
    response.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter