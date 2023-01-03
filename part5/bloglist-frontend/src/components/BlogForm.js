const FillForm = ({title, value, handle}) => {
    return(
        <div>
            {title}
            <input
                type="text"
                value={value}
                name={title}
                onChange={handle}
            />
        </div>
    )
}

const BlogForm = ({handleAddBlog, title, author, url,
            handleChangeTitle, handleChangeAuthor,
            handleChangeUrl}) => {
    return(
        <div>
            <h3>Create a new blog</h3>
            <form onSubmit={handleAddBlog}>
                <FillForm title="Title"
                    value={title}
                    handle={handleChangeTitle}
                ></FillForm>
                <FillForm title="Author"
                    value={author}
                    handle={handleChangeAuthor}
                ></FillForm>
                <FillForm title="URL"
                    value={url}
                    handle={handleChangeUrl}
                ></FillForm>
                <button type="submit">save</button>
            </form>
        </div>
    )
    
}

export default BlogForm