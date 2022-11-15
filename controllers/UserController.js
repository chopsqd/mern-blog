import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import UserModel from "../models/User.js";

export const register = async (req, res) => {
    try {
        const password = req.body.password
        // genSalt() - генерируем соль(алгоритм шифрования пароля)
        const salt = await bcrypt.genSalt(10)
        // Захешировать пароль по алгоритму salt
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash
        })

        // Сохр пользователя в БД, результат сохр заносим в user
        const user = await doc.save()

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secretKey',
            {
                expiresIn: '30d'
            }
        )

        // Убираем passwordHash из информации о пользователе
        const {passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось зарегестрировать пользователя'
        })
    }
}

export const login = async (req, res) => {
    try {
        // Ищем одного пользователя в модели UserModel // findOne({ условие для поиска })
        const user = await UserModel.findOne({ email: req.body.email })

        if(!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        // Bcrypt сравни пароль в теле запроса с паролем в документе
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if(!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль'
            })
        }

        // Создаем токен // .sign({ что шифруем }, ключ для шифрования, { срок жизни токена })
        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secretKey',
            {
                expiresIn: '30d'
            }
        )

        // Достаем св-во passwordHash, чтобы оно не попало в userData
        const {passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token
        })
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        })
    }
}

export const getMe = async (req, res) => {
    try {
        // Ищем пользователя методом findById(id пользователя) в базе UserModel
        const user = await UserModel.findById(req.userId)

        if(!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        const {passwordHash, ...userData} = user._doc

        res.json(userData)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Нет доступа'
        })
    }
}