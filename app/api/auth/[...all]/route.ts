 // path to your auth file
import { auth } from "@/app/lib/auth";
import arcjet, { BotOptions, detectBot, EmailOptions, protectSignup, shield, slidingWindow, SlidingWindowRateLimitOptions } from "@arcjet/next";
import { toNextJsHandler } from "better-auth/next-js";
import { findIp } from "@arcjet/ip";

const aj = arcjet({
    key: process.env.ARCJET_API_KEY!,
    characteristics: ["userIdOrIp", "userAgent", "deviceType", "deviceModel"],
    rules: [shield({ mode: "LIVE" })]
})

const botSettings = {mode: "LIVE", allow: []} satisfies BotOptions;

const restrictiveRateLimitSettings = {
    mode: "LIVE",
    max: 10,
    interval: "10m"
} as SlidingWindowRateLimitOptions<[]>

const laxRateLimitSettings = {
    mode: "LIVE",
    max: 60,
    interval: "1m"
} as SlidingWindowRateLimitOptions<[]>

const emailSettings = {
    mode: "LIVE",
    block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS", "FREE", "NO_GRAVATAR"]
} satisfies EmailOptions


const authHandler = toNextJsHandler(auth);

export const { GET } = authHandler;

export async function POST(req: Request) {
    const clonedRequest = req.clone();
    const decision = await checkArcjet(req);

    if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
            return new Response(null, {status: 429})
        } else if (decision.reason.isBot()) {
            return new Response(null, {status: 403})
        } else if (decision.reason.isEmail()) {
            let message: string;
            
            if (decision.reason.emailTypes.includes("INVALID")) {
                message = "Invalid email address format";
            } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
                message = "Disposable email address";
            } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
                message = "Email address has no MX records";
            } else if (decision.reason.emailTypes.includes("FREE")) {
                message = "Email address is free";
            } else if (decision.reason.emailTypes.includes("NO_GRAVATAR")) {
                message = "Email address has no Gravatar";
            } else {
                message = "Invalid email address";
            }
            return Response.json({message}, {status: 400})
        } else {
            return new Response(null, {status: 403})
        }
    }
    return authHandler.POST(clonedRequest);
}

async function checkArcjet(req: Request) {
    const body = (await req.json()) as unknown;
    const session = await auth.api.getSession({headers: req.headers});
    const userIdOrIp = (session?.user.id ?? findIp(req)) || "127.0.0.1";

    const userAgent = req.headers.get("user-agent") || "unknown";
    const deviceType = req.headers.get("device-type") || "unknown";
    const deviceModel = req.headers.get("device-model") || "unknown";

    if (req.url.endsWith("/auth/sign-up")) {
        if (body && typeof body === "object" && "email" in body && typeof body.email === "string") {
            return aj.withRule(
                protectSignup({
                    email: emailSettings,
                    bots: botSettings,
                    rateLimit: restrictiveRateLimitSettings,
                })
            ).protect(req, {
                email: body.email,
                userIdOrIp,
                userAgent,
                deviceType,
                deviceModel,
            })
        } else {
            return aj
            .withRule(detectBot(botSettings))
            .withRule(slidingWindow(restrictiveRateLimitSettings))
            .protect(req, {userIdOrIp, userAgent, deviceType, deviceModel})
        }
    }

    return aj
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(laxRateLimitSettings))
    .protect(req, {userIdOrIp, userAgent, deviceType, deviceModel})
} 
