import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

// initialise dotenv
dotenv.config()

const mailTransport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: 25,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
    },
})
export const sendMail = async mailOptions => {
    try {
        const { messageId } = await mailTransport.sendMail({
            from: 'Safalta Thapa Inc. <safalta456@gmail.com>',
            ...mailOptions,
        })
        console.info(`Mail sent: ${messageId}`)
    } catch (error) {
        console.error(error)
    }
}
