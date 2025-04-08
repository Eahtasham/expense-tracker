"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { login } from "@/lib/redux/slices/authSlice"
import type { AppDispatch } from "@/lib/redux/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { CloudUpload, Clock, FileText, Wallet, ChevronsUpDown, ArrowRight } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

type FormValues = z.infer<typeof formSchema>

export function LoginForm() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    try {
      const result = await dispatch(login(values)).unwrap()
      if (result.success) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    {
      icon: <CloudUpload className="h-5 w-5 text-yellow-300" />,
      title: "Offline Sync",
      description: "Work without internet - data syncs when you reconnect"
    },
    {
      icon: <Wallet className="h-5 w-5 text-green-500" />,
      title: "Expense Tracking",
      description: "Categorize and track all expenses in one place"
    },
    {
      icon: <ChevronsUpDown className="h-5 w-5 text-white" />,
      title: "Budget Management",
      description: "Set and monitor category budgets"
    },
    {
      icon: <FileText className="h-5 w-5 text-orange-500" />,
      title: "Reports & Analysis",
      description: "Generate detailed financial reports"
    }
  ]

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      {/* Left side - Login form */}
      <div className="w-full lg:w-1/2 p-6 lg:p-12 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Welcome to ExpenseSync</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button variant="link" className="text-sm p-0">
                    Forgot password?
                  </Button>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Right side - Utility information */}
      <div className="w-full hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-6 lg:p-12 items-center">
        <div className="max-w-lg mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Manage your expenses anywhere</h2>
            <p className="text-blue-100">
              ExpenseSync helps you track your spending, set budgets, and gain financial insights 
              with seamless offline support. Access your data anytime, even without an internet connection.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="bg-white/20 p-2 rounded-full mt-1">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="text-sm text-blue-100">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 mr-2 text-teal-300" />
              <h3 className="font-medium">Powered by Redux Toolkit</h3>
            </div>
            <p className="text-sm text-blue-100">
              Your data is securely stored in your session and managed efficiently with Redux Toolkit. 
              Experience lightning-fast performance with reliable state management.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}