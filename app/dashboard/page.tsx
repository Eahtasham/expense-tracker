"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { ExpenseList } from "@/components/expenses/expense-list"
import { ExpenseForm } from "@/components/expenses/expense-form"
import { SyncStatus } from "@/components/sync/sync-status"
import { checkSession, logout } from "@/lib/redux/slices/authSlice"
import type { RootState, AppDispatch } from "@/lib/redux/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

export default function Dashboard() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    // Check if user is authenticated
    dispatch(checkSession())
  }, [dispatch])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    dispatch(logout())
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/")
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 px-4 py-2 sm:h-16">
          <h1 className="text-xl font-bold">Expense Tracker</h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="text-sm">Welcome, {user.name}</div>
            <SyncStatus />
            <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 px-4">
        <Tabs defaultValue="expenses" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="add">Add Expense</TabsTrigger>
          </TabsList>
          <TabsContent value="expenses" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Expenses</CardTitle>
                <CardDescription>View and manage all your recorded expenses.</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseList />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="add" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Expense</CardTitle>
                <CardDescription>Record a new expense with details.</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

