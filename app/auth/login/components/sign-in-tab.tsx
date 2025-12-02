"use client";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/app/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const signInSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(6),
})

type SignInForm = z.infer<typeof signInSchema>


const SignInTab = () => {
    const router = useRouter();
    const form = useForm<SignInForm>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
          email: "",
          password: "",
        },
    })

    const {isSubmitting} = form.formState;

    async function handleSignIn(data: SignInForm) {
        await authClient.signIn.email(
            {...data, callbackURL: "/"},
            {
        onError: error => {
          toast.error(error.error.message || "Failed to sign in")
        },
        onSuccess: () => {
        toast.success("Sign in successful");
        router.push("/");
      }
      },
        )
    }
  return (
    <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSignIn)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
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
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
            <LoadingSwap isLoading={isSubmitting}>
                Sign In
            </LoadingSwap>
        </Button>
        </form>
    </Form>
  )
}

export default SignInTab
