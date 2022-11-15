import mongoose from 'mongoose'

// Создаем схему со всеми св-вами у пользователя
// timestamps: true - БД автоматич добавл дату созд/обнов этой сущности
const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    avatarUrl: String,
}, {
    timestamps: true
})

// Экспортируем модель 'User' по схеме UserSchema
export default mongoose.model('User', UserSchema)

