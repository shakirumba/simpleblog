import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'

import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { setBlogs } from '../features/blogs/blogSlice'
import { supabase } from '../lib/supabaseClient'

export default function EditBlog() {
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

  const handleCancel = () => {
    navigate('/BlogList', { replace: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { data: userData, error: authError } = await supabase.auth.getUser()

    if (authError || !userData.user) {
      alert('You must be logged in to edit a blog.')
      setLoading(false)
      return
    }

    const { error, data } = await supabase
      .from('blog_posts')
      .update({ title, category, description })
      .eq('id', id)
      .select() // Return updated row

    setLoading(false)

    if (error) {
      console.error('Supabase error:', error)
      alert(`Failed to update blog: ${error.message}`)
    } else {
      dispatch(setBlogs(data))
      alert('Blog updated successfully!')
      navigate('/BlogList', { replace: true })
    }
  }

  if (fetching) return <div className="text-white text-center mt-24">Loading blog...</div>

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 py-24 sm:py-32">
      <form className="w-full max-w-3xl px-6" onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-white/10 pb-12">
            <h2 className="text-base/7 font-semibold text-white">Edit Blog</h2>
            <p className="mt-1 text-sm/6 text-gray-400">Update your blog details</p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="title" className="block text-sm/6 font-medium text-white">
                  Title
                </label>
                <div className="mt-2">
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500"
                    placeholder="Enter blog title"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="category" className="block text-sm/6 font-medium text-white">
                  Category
                </label>
                <div className="mt-2 relative">
                  <select
                    id="category"
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white/5 py-1.5 pr-8 pl-3 text-base text-white outline-1 -outline-offset-1 outline-white/10 *:bg-gray-800 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                  >
                    <option>Technology</option>
                    <option>Business</option>
                    <option>Health & Wellness</option>
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="description" className="block text-sm/6 font-medium text-white">
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500"
                    placeholder="Write your blog here..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm/6 font-semibold text-white" onClick={handleCancel}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white focus:outline-2 focus:outline-indigo-500"
          >
            {loading ? 'Updating...' : 'Update Blog'}
          </button>
        </div>
      </form>
    </div>
  )
}
