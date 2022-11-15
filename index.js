import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

mongoose.connect('mongodb+srv://admin:12345@cluster0.f6mplrp.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('DB Connected'))
    .catch((error) => console.log('DB Error: ', error))

const app = express()
const PORT = process.env.PORT || 4444

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.post('/auth/login', (req, res) => {
    // Генерируем token // В .sign({ инфо для шифрования }, ключ для шифрования)
    const token = jwt.sign({
        email: req.body.email,
        fullName: 'Chopsqd'
    }, 'secretKey')

    res.json({
        success: true,
        token
    })
})

app.listen(PORT, (err) => {
    if(err) {
        return console.log(err)
    }

    console.log(`Server has been started on port:${PORT}...\nhttp://localhost:4444/`)
})