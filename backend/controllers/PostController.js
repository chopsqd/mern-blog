import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
    try {
        // PostModel верни все статьи
        // .populate('user').exec() - связь с другой таблицей для поля user
        const posts = await PostModel.find().populate('user').exec()

        res.json(posts)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        // Достаем динамический параметр id из url '/posts/-->:id<--'
        const postId = req.params.id

        // Найти одну статью в БД и обновить
        // findOneAndUpdate({ параметр поиска }, { что хотим обновить }, обнов + вернуть обновл результат, функция для вывода ошибок )
        PostModel.findOneAndUpdate(
            {
                _id: postId
            },
            {
                // Инкрементировать viewsCount на 1
                $inc: {viewsCount: 1}
            },
            {
                // После обновления вернуть актуальный документ
                returnDocument: 'after',
            },
            // Была ошибка или пришел документ
            (err, doc) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Не удалось вернуть статью'
                    })
                }

                // Если нет ошибки, но doc = undefined
                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья не найдена'
                    })
                }

                res.json(doc)
            }
        )
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id

        // PostModel найти одну статью и удалии ее
        // findOneAndDelete({ параметр поиска }, была ли ошибка)
        PostModel.findOneAndDelete({
            _id: postId
        }, (err, doc) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    message: 'Не удалось удалить статью'
                })
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'Статья не найдена'
                })
            }

            res.json({
                message: 'Статья удалена'
            })
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
}

export const create = async (req, res) => {
    try {
        // Создаем модель на основании данных с запроса
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })

        // Сохраняем пост в БД
        const post = await doc.save()

        res.json(post)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать статью'
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id

        // PostModel найди одну статью и обнову её
        // findOneAndDelete({ параметр поиска }, { что нужно обновить })
        await PostModel.updateOne(
            {
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.body.userId,
                tags: req.body.tags
            })

        res.json({
            message: 'Статья обновлена'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось обновить статью'
        })
    }
}