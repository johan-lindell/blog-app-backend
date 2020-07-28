var _ = require('lodash')

const dummy = blogs => {
    return 1
}

const totalLikes = blogs => {

    return blogs.reduce(((total, blog) => blog.likes + total), 0)
}

const favoriteBlog = blogs => {
    //checks if list is empty, empty list returns 0
    //non empty list runs the function
    return blogs.length === 0
    ? null
    : blogs
        .reduce((fav, blog) => {
            return blog.likes > fav.likes
            ? blog
            : fav
        }, { likes: -1 })
}

const mostBlogs = blogs => {
    if (blogs.length === 0) {
        return null
    } else {
    let authors = blogs.map(person => person.author)
    authors = _.countBy(authors)
    const authorWithMostBlogs = _.maxBy(_.keys(authors), o => authors[o])
    return ({
        author: authorWithMostBlogs,
        blogs: authors[authorWithMostBlogs]
    })}
}

const mostLikes = blogs => {
    if (blogs.length === 0) {
        return null
    } else {
    //creates a object with author and total number of likes
    const authors = blogs.reduce((obj, person) => {
        if (obj[person.author])
        {obj[person.author] += person.likes} else
        {obj[person.author] = person.likes}
        return obj
    }, {})
    console.log(authors)
    const authorWithMostLikes = _.maxBy(_.keys(authors), o => authors[o])
    return ({
        author: authorWithMostLikes,
        likes: authors[authorWithMostLikes]
    })}

}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}