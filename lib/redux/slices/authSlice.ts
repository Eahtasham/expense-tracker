import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "@/lib/types"

// Session expiration time in milliseconds (10 minutes)
const SESSION_EXPIRATION = 10 * 60 * 1000

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  sessionExpiry: number | null
  error: string | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  sessionExpiry: null,
  error: null,
}

// Helper functions for localStorage
const getUsers = (): User[] => {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem("users")
  return users ? JSON.parse(users) : []
}

const saveUser = (user: User) => {
  if (typeof window === "undefined") return
  const users = getUsers()
  const existingUserIndex = users.findIndex((u) => u.email === user.email)

  if (existingUserIndex >= 0) {
    users[existingUserIndex] = user
  } else {
    users.push(user)
  }

  localStorage.setItem("users", JSON.stringify(users))
}

const saveSession = (user: User, expiry: number) => {
  if (typeof window === "undefined") return
  localStorage.setItem(
    "session",
    JSON.stringify({
      user,
      expiry,
    }),
  )
}

const clearSession = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem("session")
}

const getSession = () => {
  if (typeof window === "undefined") return null
  const session = localStorage.getItem("session")
  return session ? JSON.parse(session) : null
}

// Async thunks
export const signup = createAsyncThunk("auth/signup", async (userData: Omit<User, "id">, { rejectWithValue }) => {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const users = getUsers()
    const existingUser = users.find((user) => user.email === userData.email)

    if (existingUser) {
      return rejectWithValue({ success: false, message: "Email already in use" })
    }

    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
    }

    saveUser(newUser)

    // Set session expiry
    const expiry = Date.now() + SESSION_EXPIRATION
    saveSession(newUser, expiry)

    return { success: true, user: newUser, expiry }
  } catch (error) {
    return rejectWithValue({ success: false, message: "Signup failed" })
  }
})

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const users = getUsers()
      const user = users.find((user) => user.email === credentials.email && user.password === credentials.password)

      if (!user) {
        return rejectWithValue({ success: false, message: "Invalid email or password" })
      }

      // Set session expiry
      const expiry = Date.now() + SESSION_EXPIRATION
      saveSession(user, expiry)

      return { success: true, user, expiry }
    } catch (error) {
      return rejectWithValue({ success: false, message: "Login failed" })
    }
  },
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    checkSession: (state) => {
      const session = getSession()

      if (!session) {
        state.isAuthenticated = false
        state.user = null
        state.sessionExpiry = null
        return
      }

      const { user, expiry } = session
      const now = Date.now()

      if (now > expiry) {
        // Session expired
        clearSession()
        state.isAuthenticated = false
        state.user = null
        state.sessionExpiry = null
        state.error = "Session expired"
      } else {
        // Session valid
        state.isAuthenticated = true
        state.user = user
        state.sessionExpiry = expiry
        state.error = null

        // Extend session
        const newExpiry = Date.now() + SESSION_EXPIRATION
        saveSession(user, newExpiry)
        state.sessionExpiry = newExpiry
      }
    },
    logout: (state) => {
      clearSession()
      state.isAuthenticated = false
      state.user = null
      state.sessionExpiry = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.fulfilled, (state, action: PayloadAction<{ success: boolean; user: User; expiry: number }>) => {
        state.isAuthenticated = true
        state.user = action.payload.user
        state.sessionExpiry = action.payload.expiry
        state.error = null
      })
      .addCase(signup.rejected, (state, action) => {
        state.isAuthenticated = false
        state.user = null
        state.sessionExpiry = null
        state.error = (action.payload as string) || "Signup failed"
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ success: boolean; user: User; expiry: number }>) => {
        state.isAuthenticated = true
        state.user = action.payload.user
        state.sessionExpiry = action.payload.expiry
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false
        state.user = null
        state.sessionExpiry = null
        state.error = (action.payload as string) || "Login failed"
      })
  },
})

export const { checkSession, logout } = authSlice.actions
export default authSlice.reducer

