"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { deleteExpense } from "@/lib/redux/slices/expenseSlice"
import type { AppDispatch, RootState } from "@/lib/redux/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { ExpenseForm } from "./expense-form"
import type { Expense } from "@/lib/types"
import { Edit, Search, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function ExpenseList() {
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()
  const { expenses } = useSelector((state: RootState) => state.expenses)
  const { isOnline } = useSelector((state: RootState) => state.sync)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      dispatch(deleteExpense(id))
      toast({
        title: "Expense deleted",
        description: isOnline
          ? "Your expense has been deleted."
          : "Your expense has been deleted and will sync when online.",
      })
    }
  }

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense)
    setIsDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getCategoryColor = (category: string) => {
    const categories: Record<string, string> = {
      food: "bg-green-100 text-green-800",
      transportation: "bg-blue-100 text-blue-800",
      entertainment: "bg-purple-100 text-purple-800",
      utilities: "bg-yellow-100 text-yellow-800",
      housing: "bg-pink-100 text-pink-800",
      healthcare: "bg-red-100 text-red-800",
      other: "bg-gray-100 text-gray-800",
    }
    return categories[category.toLowerCase()] || categories.other
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search expenses..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredExpenses.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            {searchTerm ? "No expenses match your search." : "No expenses yet. Add your first expense!"}
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getCategoryColor(expense.category)}>
                      {expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(expense.date)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(expense)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(expense.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          {selectedExpense && <ExpenseForm expense={selectedExpense} onSuccess={() => setIsDialogOpen(false)} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

