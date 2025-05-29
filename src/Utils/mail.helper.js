import nodemailer from 'nodemailer';
import { MAIL_PASS, MAIL_USER } from '../Config/config.js';

/**
 * 
 * @param  mail es un arreglo de datos que contiene el mail to, subject y html
 * @returns devuelve la respuesta de la libreria, en caso contrario el error
 */
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