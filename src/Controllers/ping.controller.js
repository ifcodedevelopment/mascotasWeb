import { mysql } from "../Config/db.js"

export const ping = async (req, res) => {
    const [result] = await mysql.query("SELECT NOW()")
    res.json(result[0])
}