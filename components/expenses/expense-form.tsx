"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addExpense, updateExpense } from "@/lib/redux/slices/expenseSlice"
import type { AppDispatch, RootState } from "@/lib/redux/store"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import type { Expense } from "@/lib/types"

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  amount: z.coerce.number().positive({ message: "Amount must be a positive number" }),
  category: z.string().min(1, { message: "Please select a category" }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Please enter a valid date" }),
})

type FormValues = z.infer<typeof formSchema>

interface ExpenseFormProps {
  expense?: Expense
  onSuccess?: () => void
}

export function ExpenseForm({ expense, onSuccess }: ExpenseFormProps = {}) {
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { isOnline } = useSelector((state: RootState) => state.sync)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: expense
      ? {
          title: expense.title,
          amount: expense.amount,
          category: expense.category,
          date: new Date(expense.date).toISOString().split("T")[0],
        }
      : {
          title: "",
          amount: 0,
          category: "",
          date: new Date().toISOString().split("T")[0],
        },
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    try {
      if (expense) {
        await dispatch(
          updateExpense({
            id: expense.id,
            title: values.title,
            amount: values.amount,
            category: values.category,
            date: new Date(values.date).toISOString(),
          }),
        )
        toast({
          title: "Expense updated",
          description: isOnline
            ? "Your expense has been updated."
            : "Your expense has been updated and will sync when online.",
        })
      } else {
        await dispatch(
          addExpense({
            id: crypto.randomUUID(),
            title: values.title,
            amount: values.amount,
            category: values.category,
            date: new Date(values.date).toISOString(),
          }),
        )
        toast({
          title: "Expense added",
          description: isOnline
            ? "Your expense has been added."
            : "Your expense has been added and will sync when online.",
        })
        form.reset({
          title: "",
          amount: 0,
          category: "",
          date: new Date().toISOString().split("T")[0],
        })
      }

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the expense.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Grocery shopping" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="housing">Housing</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : expense ? "Update Expense" : "Add Expense"}
        </Button>
      </form>
    </Form>
  )
}

