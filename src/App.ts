import express from 'express';
import { TestRouter } from './TestRouter';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { MemberRouter } from './MemberController';
import { PublicContoller, responseFailAuthentication } from './PublicController';
import { decodeToken, IAccessInfomation } from './domain/AuthManager';
import path from 'path'

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

const app = express();
const port = process.env.PORT || '3030';

// 어플리케이션 레벨 데이터 세팅

app.set('jwt-secret', process.env.SECRET_KEY);

// 어플리케이션 레벨 미들웨어 적용

const testMiddleWare = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    console.log('미들웨어 작동');
    next();
}
app.use('/test', testMiddleWare);

// 인증 미들웨어

const authMiddleWare = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    if (!request.headers.authorization) {
        responseFailAuthentication(response);
        return;
    }

    const token = request.headers.authorization.replace('Bearer ', '')
    decodeToken(request.app.get('jwt-secret'), token).then((decoded) => {
        request.session = decoded;
        next();
    }).catch((error) => {
        responseFailAuthentication(response);
    });
}

// 미들웨어 설정

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'))
app.use('/static', express.static(process.cwd() + '/public'));

// 라우터 설정

app.use('/route', cors(), authMiddleWare, TestRouter);
app.use('/member', MemberRouter);
app.use('/public', cors(), PublicContoller)

// // cors 헤더설정

// app.all('/*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     next();
// });

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

app.listen(port, () => {
    console.log(process.env.START_LOG_MESSAGE)
});
