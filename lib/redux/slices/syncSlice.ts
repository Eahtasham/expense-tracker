import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AppDispatch } from "../store"

interface PendingChange {
  type: "add" | "update" | "delete"
  data: any
}

interface SyncState {
  isOnline: boolean
  isSyncing: boolean
  pendingChanges: PendingChange[]
}

const initialState: SyncState = {
  isOnline: true,
  isSyncing: false,
  pendingChanges: [],
}

// Helper functions for localStorage
const getPendingChanges = (): PendingChange[] => {
  if (typeof window === "undefined") return []
  const changes = localStorage.getItem("pendingChanges")
  return changes ? JSON.parse(changes) : []
}

const savePendingChanges = (changes: PendingChange[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("pendingChanges", JSON.stringify(changes))
}

// Load pending changes from localStorage
const loadPendingChanges = (): PendingChange[] => {
  return getPendingChanges()
}

const syncSlice = createSlice({
  name: "sync",
  initialState: {
    isOnline: true,
    isSyncing: false,
    pendingChanges: loadPendingChanges(),
  },
  reducers: {
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload
    },
    setSyncingStatus: (state, action: PayloadAction<boolean>) => {
      state.isSyncing = action.payload
    },
    addPendingChange: (state, action: PayloadAction<PendingChange>) => {
      state.pendingChanges.push(action.payload)
      savePendingChanges(state.pendingChanges)
    },
    clearPendingChanges: (state) => {
      state.pendingChanges = []
      savePendingChanges(state.pendingChanges)
    },
  },
})

// Thunk to sync pending changes
export const syncPendingChanges = () => {
  return async (dispatch: AppDispatch, getState: () => any) => {
    const { pendingChanges } = getState().sync

    if (pendingChanges.length === 0) return

    dispatch(setSyncingStatus(true))

    // Simulate API call with random delay between 1-3 seconds
    const delay = Math.floor(Math.random() * 2000) + 1000
    await new Promise((resolve) => setTimeout(resolve, delay))

    dispatch(clearPendingChanges())
    dispatch(setSyncingStatus(false))
  }
}

export const { setOnlineStatus, setSyncingStatus, addPendingChange, clearPendingChanges } = syncSlice.actions
export default syncSlice.reducer

