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
export const SECRET_KEY_JWT = process.env.JWT_SECRET || ''
export const EXPIRES_KEY_JWT = process.env.JWT_EXPIRES_IN || ''

//Mail
export const MAIL_USER = process.env.MAIL_USER || ''
export const MAIL_PASS = process.env.MAIL_PASS || ''