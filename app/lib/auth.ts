import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../drizzle/db";
import { nextCookies } from "better-auth/next-js";
import { sendPasswordResetEmail } from "./emails/password-reset-email";
import { sendEmailVerificationEmail } from "./emails/email-verification";

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({user, url}) => {
            await sendPasswordResetEmail({user, url})
        },
    },
    emailVerification: {
        autoSignInAfterVerification: true,
        sendOnSignUp: true,
        sendVerificationEmail: async ({user, url}) => {
            await sendEmailVerificationEmail({user, url})
        },
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        }
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5, // 5 minutes
        }
    },
    plugin: [nextCookies()],
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
});
function sendVerificationEmail(arg0: { user: { id: string; createdAt: Date; updatedAt: Date; email: string; emailVerified: boolean; name: string; image?: string | null | undefined; }; url: string; }) {
    throw new Error("Function not implemented.");
}

