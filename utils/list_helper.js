
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
    ? 0
    : blogs
        .reduce((fav, blog) => {
            return blog.likes > fav.likes
            ? blog
            : fav
        }, { likes: -1 })
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}