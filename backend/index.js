import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import cors from 'cors'

import {loginValidation, postCreateValidation, registerValidation} from "./validations/validations.js";
import {checkAuth, handleValidationErrors, key} from "./utils/index.js";
import {UserController, PostController} from './controllers/index.js'

mongoose.connect(key)
    .then(() => console.log('DB Connected'))
    .catch((error) => console.log('DB Error: ', error))

const app = express()
const PORT = process.env.PORT || 4444

// Создаем хранилище для сохранения картинок
const storage = multer.diskStorage({
    // Путь для сохранения картинок
    destination: (_, __, cb) => {
        // Сохранить загруженные файлы в папку uploads (Путь для сохранения файла)
        cb(null, 'uploads')
    },
    // Как будет называться файл
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
})

// Функция для использования хранилища 'storage'
const upload = multer({ storage })

app.use(express.json())
app.use(cors())
// Если запрос на /uploads, то проверяем содержимое статической папки uploads
app.use('/uploads', express.static('uploads'))

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

// upload.single('image') - Указываем, что мы ожидаем св-во image с картинкой
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get('/tags', PostController.getLastTags)

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log(`Server has been started on port:${PORT}...\nhttp://localhost:4444/`)
})