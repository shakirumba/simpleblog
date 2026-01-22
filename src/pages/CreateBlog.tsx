import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { XCircleIcon } from '@heroicons/react/24/solid';

import { useState, useRef  } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setBlogs } from '../features/blogs/blogSlice'
import { supabase } from '../lib/supabaseClient'

export default function CreateBlog() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Technology')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null);
  

  const handlecancel = async () => {    
    navigate('/BlogList', { replace: true })
  }
  

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    alert('Login required')
    setLoading(false)
    return
  }

  let image_url = null

  if (imageFile) {
    const fileName = `${Date.now()}-${imageFile.name}`

    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(fileName, imageFile)

    if (uploadError) {
      alert('Image upload failed')
      setLoading(false)
      return
    }

    image_url = supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName).data.publicUrl
  }

  const { error } = await supabase
    .from('blog_posts')
    .insert({
      title,
      category,
      description,
      author_id: user.id,
      image_url,
    })

  setLoading(false)

  if (error) alert(error.message)
  else navigate('/BlogList')
}



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 py-24 sm:py-32">
      <form className="w-full max-w-3xl px-6" onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-white/10 pb-12">
            <h2 className="text-base/7 font-semibold text-white">Create a Blog</h2>
            <p className="mt-1 text-sm/6 text-gray-400">What's on your mind</p>

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
             <div className="sm:col-span-4">
            <label className="block text-sm font-medium text-white">
              Cover Image
            </label>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}  
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="mt-2 block w-full text-sm text-gray-300"
        />

        {imageFile && (
          <div className="relative mb-4">
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Blog"
              className="w-full max-h-64 object-cover rounded-md"
            />
            <button
              type="button"
              onClick={() => {
                setImageFile(null); 
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''; 
                }
              }}
              className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 p-1 rounded-full hover:bg-gray-700"
            >
              <XCircleIcon className="w-6 h-6 text-red-500" />
            </button>
          </div>
        )}


          </div>

            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm/6 font-semibold text-white"
          onClick={handlecancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white focus:outline-2 focus:outline-indigo-500"
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  )
}