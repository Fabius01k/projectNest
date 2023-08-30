//
//
//
// type TVblogs = {
//
//     id: string
//     name: string
//     description: string
//     websiteUrl: string
// }
// const valueWebsiteUrl = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
// export let blogs: TVblogs[] = []
//
//
//
// export const blogsRepository = {
//
//     async findBlogs() {
//         return Promise.resolve(blogs)
//     },
//
//     async createBlog(name: string, description: string, websiteUrl: string) {
//
//         const dateNow = new Date().getTime().toString()
//         const newBlog: TVblogs = {
//             id: dateNow,
//             name: name,
//             description: description,
//             websiteUrl: websiteUrl
//
//         }
//         blogs.push(newBlog)
//         return Promise.resolve(newBlog)
//
//     },
//
//     async getBlogById(id: string) {
//         const blog = blogs.find(b => b.id === id)
//         return Promise.resolve(blog)
//     },
//
//     async updateBlog(id: string, name: string, description: string, websiteUrl: string ) {
//
//         const blog = blogs.find(b => b.id === id)
//         if (blog) {
//
//             blog.name = name
//             blog.description = description
//             blog.websiteUrl = websiteUrl
//             return Promise.resolve(blog)
//         }
//
//         return null
//     },
//
//     async deleteBlog(id: string) {
//         return new Promise((resolve, reject) => {
//             for (let i = 0; i < blogs.length; i++) {
//                 if (blogs[i].id === id) {
//                     blogs.splice(i, 1)
//                     resolve(true)
//                 }
//             }
//             resolve(false)
//         })
//
//     }
//
// }
