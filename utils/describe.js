

const favoriteBlog = blogs => {
    const reducer = (fav, blog) => {
        if (blog.likes > fav.likes) return blog
    }
    return blogs.lenght === 0
    ? 0
    : blogs.reduce(reducer, { likes: -1 })
}


module.exports = {
    favoriteBlog
}