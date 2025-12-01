import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInTab from "./components/sign-in-tab";
import SignUpTab from "./components/sign-up-tab";

export default function LoginPage () {
  return (
  <Tabs defaultValue="signin">
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
            </Card>
        </TabsContent>
        <TabsContent value="signup">
            <Card className="max-w-2xl">
            <CardHeader className="text-2xl font-bold">
                <CardTitle>Sign Up</CardTitle>
            </CardHeader>
            <CardContent>
                <SignUpTab />
            </CardContent>
            </Card>
        </TabsContent>
  </Tabs>
)}
