import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { Sequelize } from 'sequelize'
import Member, { Member as MemberModel } from './model/Member'
import AccessController, { responseFailAuthentication } from './router/AccessController'
import { decodeToken, IAccessInfomation } from './TokenManager'

// sequelize

const sequelize = new Sequelize('sqlite:' + process.cwd() + '/database/database.db');
Member(sequelize);

// 리퀘스트 객체에 필요한 타입을 추가하기위함

declare global {
    namespace Express {
        interface Request {
            session: IAccessInfomation | undefined
        }
    }
}

// dotenv
dotenv.config({
    path: path.resolve(
        process.cwd(),
        process.env.NODE_ENV === 'production' ? '.env' : '.env.dev'
    )
})

const app = express()
const port = process.env.PORT || '3030'

// 어플리케이션 레벨 데이터 세팅

app.set('jwt-secret', process.env.SECRET_KEY)

// 어플리케이션 레벨 미들웨어 적용

const testMiddleWare = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    console.log('미들웨어 작동')
    next()
}
app.use('/test', testMiddleWare)

// 인증 미들웨어

const authMiddleWare = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    if (!request.headers.authorization) {
        responseFailAuthentication(response)
        return
    }

    const token = request.headers.authorization.replace('Bearer ', '')
    decodeToken(request.app.get('jwt-secret'), token).then((decoded) => {
        request.session = decoded
        next()
    }).catch((error) => {
        responseFailAuthentication(response)
    })
}

// 미들웨어 설정

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(morgan('dev'))
app.use('/static', express.static(process.cwd() + '/public'))

// 라우터 설정

app.use('/public', cors(), AccessController);

// // cors 헤더설정

// app.all('/*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*")
//     res.header("Access-Control-Allow-Headers", "X-Requested-With")
//     next()
// })

// test api

app.get('/needauth', cors(), authMiddleWare, (request: express.Request, response: express.Response, next: express.NextFunction) => {
    response.json({
        data: 'hello'
    })
})

app.get('/testcors', cors(), (request: express.Request, response: express.Response, next: express.NextFunction) => {
    response.json({
        message: '/testcors api call ok'
    })
})

app.get('/testnocors', (request: express.Request, response: express.Response, next: express.NextFunction) => {
    response.json({
        message: '/testnocors api call ok'
    })
})

// server start

const makeAdmin = async () => {
    try {
        await sequelize.sync();

        const admin = await MemberModel.findOne({
            where: {
                loginId: 'admin'
            }
        });

        if (!admin && process.env.ADMIN_PASSWORD) {
            await MemberModel.create({
                loginId: 'admin',
                name: 'admin',
                password: process.env.ADMIN_PASSWORD,
                iaAdmin: 'Y'
            });
        }
    } catch (error) {
        console.error(error)
    }
}

app.listen(port, async () => {
    await makeAdmin();

    console.log(process.env.START_LOG_MESSAGE)
})
