"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInTab from "./components/sign-in-tab";
import SignUpTab from "./components/sign-up-tab";
import { Separator } from "@/components/ui/separator";
import SocialAuthButtons from "./components/social-auth-buttons";
import { useEffect, useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { EmailVerification } from "./components/email-verification";

type Tab = "signin" | "signup" | "email-verification" | "forgot-password"

export default function LoginPage () {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [selectedTab, setSelectedTab] = useState<Tab>("signin")

    useEffect(() => {
        authClient.getSession().then(session => {
            if (session.data !== null) {
                router.push('/')
            }
        })
    }, [router])

    function openEmailVerificationTab(email: string) {
        setEmail(email)
        setSelectedTab("email-verification")
    }

  return (
  <Tabs 
      value={selectedTab}
      onValueChange={t => setSelectedTab(t as Tab)}
      className="max-auto w-full my-6 px-4"
    >
    <TabsList>
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
    </TabsList>
        <TabsContent value="signin">
            <Card className="max-w-2xl">
            <CardHeader className="text-2xl font-bold">
                <CardTitle>Sign In</CardTitle>
            </CardHeader>
            <CardContent>
                <SignInTab />
            </CardContent>
            <Separator />

            <CardFooter className="grid grid-cols-2 gap-3">
                <SocialAuthButtons />
            </CardFooter>
            </Card>
        </TabsContent>
        <TabsContent value="signup">
            <Card className="max-w-2xl">
            <CardHeader className="text-2xl font-bold">
                <CardTitle>Sign Up</CardTitle>
            </CardHeader>
            <CardContent>
                <SignUpTab openEmailVerificationTab={openEmailVerificationTab}/>
            </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="email-verification">
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle>Verify Your Email</CardTitle>
          </CardHeader>
          <CardContent>
            <EmailVerification email={email} />
          </CardContent>
        </Card>
      </TabsContent>
  </Tabs>
)}
