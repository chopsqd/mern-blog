import express from 'express'
import mongoose from 'mongoose'
import {loginValidation, postCreateValidation, registerValidation} from "./validations/validations.js";

import checkAuth from "./utils/checkAuth.js";
import {key} from "./utils/MongoDB-key.js";

import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'

mongoose.connect(key)
    .then(() => console.log('DB Connected'))
    .catch((error) => console.log('DB Error: ', error))

const app = express()
const PORT = process.env.PORT || 4444

app.use(express.json())

app.post('/auth/login', loginValidation,  UserController.login)
app.post('/auth/register', registerValidation, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

// Получение всех статей | GET
app.get('/posts', PostController.getAll)

// Получение конкретной статьи | GET
app.get('/posts/:id', PostController.getOne)

// Создание статьи | POST
app.post('/posts', checkAuth, postCreateValidation, PostController.create)

// Удаление статьи | DELETE
app.delete('/posts/:id', checkAuth, PostController.remove)

// Изменение статьи | PATCH
app.patch('/posts/:id', checkAuth, PostController.update)

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log(`Server has been started on port:${PORT}...\nhttp://localhost:4444/`)
})