import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setBlogs } from '../features/blogs/blogSlice'
import { supabase } from '../lib/supabaseClient'
import { useNavigate, useParams } from 'react-router-dom'
import BlogComments from '../components/BlogComments';


function ViewBlog() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams() 

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Technology')
  const [description, setDescription] = useState('')
  const [author, setAuthor] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

   useEffect(() => {
      const fetchBlog = async () => {
        setFetching(true)
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            *,
              users(
              auth_id,
                username,
                role
              )
            `)
          .eq('id', id)
          .single() 
  
           console.log(data)
        if (error) {
          console.error('Error fetching blog:', error)
          alert('Failed to load blog.')
          navigate('/BlogList', { replace: true })
        } else {
          setTitle(data.title)
          setCategory(data.category)
          setDescription(data.description)
          setImageUrl(data.image_url)
          setAuthor(data.users.username)
        }
        setFetching(false)
      }
  
      if (id) fetchBlog()
    }, [id, navigate])

     if (fetching) return <div className="text-white text-center mt-24">Loading blog...</div>

    return (
    <div className="max-w-screen-xl mx-auto p-5 sm:p-8 md:p-12 relative">
      
    <div
    className="bg-cover h-64 text-center overflow-hidden"
    style={{
      height: "450px",
      backgroundImage: `url(${imageUrl})`, 
    }}
  ></div>

  <div className="max-w-2xl mx-auto">
    <div className="mt-3  rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal">
      <div>
        <div className="flex gap-2">
          <a
            href="#"
            className="text-xs text-indigo-600 uppercase font-medium hover:text-gray-900 transition duration-500 ease-in-out"
          >
            {category}
          </a>
        </div>

        <h1 className="text-white font-bold text-3xl mb-2">
          {title}
        </h1>

        <p className="text-white text-xs mt-2">
          Written By:{" "}
          <a
            href="#"
            className="text-indigo-600 font-medium hover:text-gray-900 transition duration-500 ease-in-out"
          >
            {author }
          </a>
        </p>

        <p className="text-base text-white leading-8 my-5">
          {description}
        </p>

         <div className="relative p-4 bg-gray-900">
      {/* your blog content */}
      <BlogComments blogId={id} /> {/* pass the blog ID */}
    </div>

        
      </div>
    </div>
  </div>
</div>


    )



    }

export default ViewBlog;