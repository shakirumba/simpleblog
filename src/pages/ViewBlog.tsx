import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setBlogs } from '../features/blogs/blogSlice'
import { supabase } from '../lib/supabaseClient'
import { useNavigate, useParams } from 'react-router-dom'


function ViewBlog() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams() 

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Technology')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

   useEffect(() => {
      const fetchBlog = async () => {
        setFetching(true)
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single() 
  
        if (error) {
          console.error('Error fetching blog:', error)
          alert('Failed to load blog.')
          navigate('/BlogList', { replace: true })
        } else {
          setTitle(data.title)
          setCategory(data.category)
          setDescription(data.description)
        }
        setFetching(false)
      }
  
      if (id) fetchBlog()
    }, [id, navigate])

     if (fetching) return <div className="text-white text-center mt-24">Loading blog...</div>

    return (
   <div className="relative p-4 bg-gray-900">
    <div className=" mx-auto">
        <div className="mt-3 bg-gray-900 rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal">
            <div className="">
                <a href="#" className="text-indigo-600 hover:text-gray-700 transition duration-500 ease-in-out text-sm">
                    {category}
                </a>
                <h1 className=" text-white font-bold text-4xl">{title}</h1>
                
                <div className="py-5 text-sm font-regular flex">
                
                </div>
                <hr />

                <p className="text-white text-base leading-8 my-5">
                   {description}
                </p>

                
            </div>
        </div>
    </div>
</div>

    )



    }

export default ViewBlog;