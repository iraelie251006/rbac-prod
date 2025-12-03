import { ServerClient } from "postmark"

const postmarkClient = new ServerClient(process.env.POSTMARK_SERVER_TOKEN!)

interface SendEmail {
    to: string
    subject: string
    html: string
    text: string
}

export function sendEmail({to, subject, html, text}: SendEmail) {
    return postmarkClient.sendEmail({
        From: process.env.POSTMARK_FROM_EMAIL!,
        To: to,
        Subject: subject,
        HtmlBody: html,
        TextBody: text
    })
}
