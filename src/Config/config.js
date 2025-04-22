import { config } from 'dotenv'
import nodemailer from 'nodemailer'

config()

//Node
export const PORT = process.env.PORT || 3000
export const HOST = process.env.HOST || 'localhost'

//Base de datos
export const DB_HOST = process.env.DB_HOST || 'localhost'
export const DB_PORT = process.env.DB_PORT || 3306
export const DB_USER = process.env.DB_USER || 'root'
export const DB_PASSWORD = process.env.DB_PASSWORD || ''
export const DB_DATABASE = process.env.DB_DATABASE || 'companydb'

//JWT
export const SECRET_KEY = process.env.SECRET_KEY || ''

//Mail
export const MAIL_USER = process.env.MAIL_USER || ''
export const MAIL_PASS = process.env.MAIL_PASS || ''


//getDate
export const getDate = (format) => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0') // Month is zero-based
    const day = String(now.getDate()).padStart(2, '0')

    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    switch (format) {
        case 'Y-m-d H:i:s':
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        case 'Y-m-d':
            return `${year}-${month}-${day}`
        case 'H:i:s':
            return `${hours}:${minutes}:${seconds}`
        case 'Y':
            return `${year}`
        case 'm':
            return `${month}`
        default:
            return null
    }
}

export const mailSend = async (mail) => {
    let send = true
    let sender = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: MAIL_USER,
            pass: MAIL_PASS
        }
    })

    let mailOptions = {
        from: '"Mascotas App"',
        to: mail.to,
        subject: mail.subject,
        html: mail.content
    }
    sender.sendMail(mailOptions, function (error, info) {
        if (error) {
            send = false
        }
    })

    return send
}