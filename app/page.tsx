"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "./lib/auth-client";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action";

export default function Home() {
  const {data: session, isPending: loading} = authClient.useSession();

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <div className="my-6 px-4 max-w-md mx-auto">
      <div className="text-center space-y-6">
        {session == null ? (
          <>
            <h1 className="text-3xl font-bold">Welcome to my mastery</h1>
            <Button asChild size="lg">
              <Link href="/auth/login">Sign In/ Sign Up</Link>
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Welcome {session?.user?.name}</h1>
            <BetterAuthActionButton 
              size="lg" 
              variant="destructive" 
              action={() => authClient.signOut()}>
              Sign Out
            </BetterAuthActionButton>
          </>
        )}
        
      </div>
    </div>
  );
}
