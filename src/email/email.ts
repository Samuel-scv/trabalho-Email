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

export async function enviarEmailRecuperacao(email: string, nome: string, codigo: string) {
    await transporter.sendMail({
        from: "naoresponda@cyberware.com",
        to: email,
        subject: "Recuperação de senha - Cyberware",
        text: `Olá, ${nome}!\n\nSeu código de recuperação de senha é: ${codigo}\n\nUtilize esse código na tela de redefinição de senha para criar uma nova senha. Esse código é de uso único.\n\nCaso não tenha solicitado essa recuperação, ignore este e-mail.`
    })
}