import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Expense } from "@/lib/types"
import { addPendingChange } from "./syncSlice"
import type { AppDispatch } from "../store"

interface ExpensesState {
  expenses: Expense[]
}

const initialState: ExpensesState = {
  expenses: [],
}

// Helper functions for localStorage
const getExpenses = (): Expense[] => {
  if (typeof window === "undefined") return []
  const expenses = localStorage.getItem("expenses")
  return expenses ? JSON.parse(expenses) : []
}

const saveExpenses = (expenses: Expense[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("expenses", JSON.stringify(expenses))
}

// Load expenses from localStorage
const loadExpenses = (): Expense[] => {
  return getExpenses()
}

const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    expenses: loadExpenses(),
  },
  reducers: {
    setExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.expenses = action.payload
      saveExpenses(state.expenses)
    },
    addExpenseSuccess: (state, action: PayloadAction<Expense>) => {
      state.expenses.push(action.payload)
      saveExpenses(state.expenses)
    },
    updateExpenseSuccess: (state, action: PayloadAction<Expense>) => {
      const index = state.expenses.findIndex((expense) => expense.id === action.payload.id)
      if (index !== -1) {
        state.expenses[index] = action.payload
        saveExpenses(state.expenses)
      }
    },
    deleteExpenseSuccess: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter((expense) => expense.id !== action.payload)
      saveExpenses(state.expenses)
    },
  },
})

// Thunks
export const addExpense = (expense: Expense) => {
  return (dispatch: AppDispatch, getState: () => any) => {
    const { isOnline } = getState().sync

    if (isOnline) {
      // Simulate API call
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          dispatch(addExpenseSuccess(expense))
          resolve()
        }, 500)
      })
    } else {
      // Store in pending changes
      dispatch(
        addPendingChange({
          type: "add",
          data: expense,
        }),
      )
      dispatch(addExpenseSuccess(expense))
      return Promise.resolve()
    }
  }
}

export const updateExpense = (expense: Expense) => {
  return (dispatch: AppDispatch, getState: () => any) => {
    const { isOnline } = getState().sync

    if (isOnline) {
      // Simulate API call
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          dispatch(updateExpenseSuccess(expense))
          resolve()
        }, 500)
      })
    } else {
      // Store in pending changes
      dispatch(
        addPendingChange({
          type: "update",
          data: expense,
        }),
      )
      dispatch(updateExpenseSuccess(expense))
      return Promise.resolve()
    }
  }
}

export const deleteExpense = (id: string) => {
  return (dispatch: AppDispatch, getState: () => any) => {
    const { isOnline } = getState().sync

    if (isOnline) {
      // Simulate API call
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          dispatch(deleteExpenseSuccess(id))
          resolve()
        }, 500)
      })
    } else {
      // Store in pending changes
      dispatch(
        addPendingChange({
          type: "delete",
          data: { id },
        }),
      )
      dispatch(deleteExpenseSuccess(id))
      return Promise.resolve()
    }
  }
}

export const { setExpenses, addExpenseSuccess, updateExpenseSuccess, deleteExpenseSuccess } = expenseSlice.actions
export default expenseSlice.reducer

