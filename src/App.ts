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

// 인증 미들웨어

const authMiddleWare = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    if(!request.headers.authorization) {
        throw new Error('df')
    }

    const token = request.headers.authorization.replace('Bearer ','')
    decodeToken(request.app.get('jwt-secret'), token).then((decoded) => {
        console.log('ok', decoded)
        request.body.session = decoded;
        request.params.session = decoded;
        next();
    });
}

// 미들웨어 설정

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'))

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

app.listen(port);