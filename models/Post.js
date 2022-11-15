import mongoose from 'mongoose'

// Создаем схему со всеми св-вами поста
// timestamps: true - БД автоматич добавл дату созд/обнов этой сущности
const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        default: []
    },
    viewsCount: {
        type: Number,
        default: 0
    },
    user: {
        // Связь с таблицей User
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: String,
}, {
    timestamps: true
})

// Экспортируем модель 'Post' по схеме PostSchema
export default mongoose.model('Post', PostSchema)

