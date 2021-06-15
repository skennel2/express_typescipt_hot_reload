import * as express from 'express';
import { TestRouter } from './TestRouter';
import { TestRouter2 } from './TestRouter2';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';

const app = express.default();
const port = process.env.PORT || '3030';

const testMiddleWare = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    console.log('미들웨어 작동');
    next();
}

app.set('jwt-secret', 'this is secret');

app.use('/test', testMiddleWare);
app.use('/route', TestRouter);
app.use('/route2', TestRouter2);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'))

// test api

app.get('/gettoken', (request, response, next) => {
    const secret = request.app.get('jwt-secret');

    jwt.sign(
        {
            value: 'test'
        },
        secret,
        {
            expiresIn: '7d',
            issuer: 'velopert.com',
            subject: 'userInfo'
        }, (err, token) => {
            response.json({
                data: token,
                testValue: '22',
            });
        }
    )
})

app.get('/checktoken', (request, response, next) => {
    handleRequestCheckToken(request, response);
})

const handleRequestCheckToken = (request: express.Request, response: express.Response) => {
    const token = request.query.token;

    if (!token) {
        return response.status(403).json({
            message: '인증실패',
            token: token
        })
    }

    jwt.verify(String(token), request.app.get('jwt-secret'), (error: any, decoded: any) => {
        if (error) {
            console.log(error)
            return response.status(403).json({
                message: '인증실패',
                token: token
            })
        }

        response.json({
            message: '인증성공',
            data: decoded,
            token: token
        })
    })
}

app.listen(port);