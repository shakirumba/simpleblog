import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  email: string
}

interface AuthState {
  user: User | null
}

const initialState: AuthState = {
  user: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload
    },
    logout(state) {
      state.user = null
    }
  }
})

export const { setUser, logout } = authSlice.actions
export default authSlice.reducer
