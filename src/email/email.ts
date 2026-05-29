import nodemailer from "nodemailer"
 
export const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAILTRAP_EMAIL,
        pass: process.env.MAILTRAP_SENHA,
    }
})
 