import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


interface Blog {
  id: string
  title: string
  content: string
}

interface BlogState {
  blogs: Blog[]
}

const initialState: BlogState = {
  blogs: [],
}

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs(state, action: PayloadAction<Blog[]>) {
      state.blogs = action.payload
    },
  },
})

export const { setBlogs } = blogSlice.actions

export default blogSlice.reducer
