import app from './app.js'
import { PORT } from './Config/config.js'

app.listen(PORT)
console.log(`server running on port ${PORT}`)