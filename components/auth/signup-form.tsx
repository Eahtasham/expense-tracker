"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signup } from "@/lib/redux/slices/authSlice"
import type { AppDispatch } from "@/lib/redux/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { CloudUpload, ShieldCheck, BarChart, ArrowUpCircle, ChevronRight, UserPlus } from "lucide-react"

const formSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type FormValues = z.infer<typeof formSchema>

export function SignupForm() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    try {
      const result = await dispatch(
        signup({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      ).unwrap()

      if (result.success) {
        toast({
          title: "Account created",
          description: "Your account has been created successfully.",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Signup failed",
          description: "An error occurred during signup",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "An error occurred during signup",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = [
    {
      icon: <CloudUpload className="h-5 w-5 text-emerald-500" />,
      title: "Offline Sync",
      description: "Access your financial data anytime, anywhere"
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-orange-500" />,
      title: "Secure Storage",
      description: "Your data is securely managed with Redux"
    },
    {
      icon: <BarChart className="h-5 w-5 text-amber-500" />,
      title: "Visual Analytics",
      description: "Track spending patterns with intuitive charts"
    },
    {
      icon: <ArrowUpCircle className="h-5 w-5 text-teal-500" />,
      title: "Goal Tracking",
      description: "Set and monitor your saving goals"
    }
  ]

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      {/* Left side - Signup form */}
      <div className="w-full lg:w-1/2 p-6 lg:p-12 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>Join ExpenseSync and start managing your finances</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create account"}
                  <UserPlus className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/" className="text-primary font-medium hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Right side - Utility information */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-6 lg:p-12 flex items-center">
        <div className="max-w-lg mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Start Your Financial Journey</h2>
            <p className="text-emerald-100">
              Join thousands of users who are taking control of their expenses with ExpenseSync.
              Our unique offline sync technology ensures you're never without your financial data.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="bg-white/20 p-2 rounded-full mt-1">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-medium">{benefit.title}</h3>
                  <p className="text-sm text-emerald-100">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h3 className="font-medium mb-2 flex items-center">
              <ChevronRight className="h-5 w-5 mr-2 text-emerald-300" />
              Get Started in Minutes
            </h3>
            <ul className="text-sm text-emerald-100 space-y-2">
              <li className="flex items-start">
                <span className="bg-emerald-400 text-emerald-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
                Create your account with your email
              </li>
              <li className="flex items-start">
                <span className="bg-emerald-400 text-emerald-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
                Set up your expense categories
              </li>
              <li className="flex items-start">
                <span className="bg-emerald-400 text-emerald-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span>
                Start tracking your finances and sync across devices
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}