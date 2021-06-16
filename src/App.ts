import express from 'express';
import { TestRouter } from './TestRouter';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import cors from 'cors';
import { MemberRouter } from './MemberController';
import { PublicContoller } from './PublicController';
import { resolve } from 'path';
import { decodeToken } from './domain/AuthManager';

const app = express();
const port = process.env.PORT || '3030';

// 어플리케이션 레벨 데이터 세팅

app.set('jwt-secret', 'this is secret');

// 어플리케이션 레벨 미들웨어 적용

const testMiddleWare = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    console.log('미들웨어 작동');
    next();
}
app.use('/test', testMiddleWare);

// 미들웨어 설정

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'))

// 라우터 설정

app.use('/route', TestRouter);
app.use('/member', MemberRouter);
app.use('/public', cors(), PublicContoller)

// // cors 헤더설정
app.use(cors())
// app.all('/*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     next();
// });

// test api

app.get('/needauth', cors({
    allowedHeaders: 'Authorization'
}), (request: express.Request, response: express.Response, next: express.NextFunction) => {
    if(!request.headers.authorization) {
        response.status(403).json({
            message: '/testcors api call ok'
        })
        return;
    }

    const token = request.headers.authorization.replace('Bearer ','')
    decodeToken(request.app.get('jwt-secret'), token).then((decoded) => {
        response.json({
            message: decoded
        })
    });
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

app.listen(port);