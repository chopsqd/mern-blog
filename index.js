import express from 'express'
import mongoose from 'mongoose'
import {registerValidation} from "./validations/auth.js";

import checkAuth from "./utils/checkAuth.js";
import * as UserController from './controllers/UserController.js'

mongoose.connect('mongodb+srv://admin:12345@cluster0.f6mplrp.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB Connected'))
    .catch((error) => console.log('DB Error: ', error))

const app = express()
const PORT = process.env.PORT || 4444

app.use(express.json())

app.post('/auth/login', UserController.login)
app.post('/auth/register', registerValidation, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe())

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log(`Server has been started on port:${PORT}...\nhttp://localhost:4444/`)
})