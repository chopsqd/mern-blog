// checkAuth - middleware функция
import jwt from "jsonwebtoken";

export default (req, res, next) => {
    // Получаем чистый токен, удаляя строку Bearer
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

    if(token) {
        try {
            // Расшифровываем токен verify(токен, ключ шифрования)
            const decoded = jwt.verify(token, 'secretKey')

            // Сохраняем расшифрованный id в свойства запроса (req), для дальнейшего использования
            req.userId = decoded._id

            // Все ок, выполняй следующую функцию
            next()
        } catch(err) {
            return res.status(403).json({
                message: 'Нет доступа'
            })
        }
    } else {
        return res.status(403).json({
            message: 'Нет доступа'
        })
    }
}
