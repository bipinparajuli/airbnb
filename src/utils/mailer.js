import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

// initialise dotenv
dotenv.config()

const mailTransport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    service: 'gmail',
    secure: true,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PW,
    },
})
export const sendMail = async mailOptions => {
    console.log(mailOptions);
    try {
        const { messageId } = await mailTransport.sendMail({
            from: 'bipinprjl@gmail.com',
            ...mailOptions,
        })
        console.info(`Mail sent: ${messageId}`)
    } catch (error) {
        console.error(error)
    }
}
