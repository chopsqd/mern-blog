import express from 'express'

const app = express()
const PORT = process.env.PORT || 4444

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.listen(PORT, (err) => {
    if(err) {
        return console.log(err)
    }

    console.log(`Server has been started on port:${PORT}...\nhttp://localhost:4444/`)
})