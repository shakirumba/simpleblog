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

    return (
       <div className="min-h-screen flex justify-center bg-gray-900">
            {title}
            {category}
            {description}
        </div>

    )



    }

export default ViewBlog;