import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { Sequelize } from 'sequelize'
import Member, { Member as MemberModel } from './model/Member'
import AccessController, { responseFailAuthentication } from './router/AccessController'
import UpdateHistoryController from './router/UpdateHistoryController'
import { decodeToken, IAccessInfomation } from './TokenManager'
import UpdateList, { UpdateData, IUpdateData, UpdateWarningLevel } from './model/UpdateList'

// sequelize

const sequelize = new Sequelize('sqlite:' + process.cwd() + '/database/database.db')
Member(sequelize)
UpdateList(sequelize)

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
        console.log(error)
        responseFailAuthentication(response)
    })
}

// 미들웨어 설정

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(morgan('dev'))
app.use('/static', express.static(process.cwd() + '/public'))

// 라우터 설정

app.use('/public', cors(), AccessController)
app.use('/update', cors(), UpdateHistoryController)

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
        const admin = await MemberModel.findOne({
            where: {
                loginId: 'admin'
            }
        })

        if (!admin && process.env.ADMIN_PASSWORD) {
            await MemberModel.create({
                loginId: 'admin',
                name: 'admin',
                password: process.env.ADMIN_PASSWORD,
                iaAdmin: 'Y'
            })
        }
    } catch (error) {
        console.error(error)
        throw error

    }
}

const makeUpdateList = async () => {
    try {
        const testUpdateData = {
            subject: 'test',
            componentName: 'etc',
            type: 'bug',
            warningLevel: '1',
            updateDate: '20210101',
        } as IUpdateData

        await UpdateData.create(testUpdateData)

        const testUpdateData2 = {
            subject: 'hhh',
            componentName: 'etc',
            type: 'bug',
            warningLevel: '1',
            updateDate: '20210103',
        } as IUpdateData

        await UpdateData.create(testUpdateData2)
    } catch (error) {
        console.error(error)
        throw error
    }
}

app.listen(port, async () => {
    await sequelize.sync()
    await makeAdmin()
    await makeUpdateList()

    console.log(process.env.START_LOG_MESSAGE)
})
