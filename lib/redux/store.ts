import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import expenseReducer from "./slices/expenseSlice"
import syncReducer from "./slices/syncSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expenseReducer,
    sync: syncReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

