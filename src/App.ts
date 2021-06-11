import * as express from 'express';
import { TestRouter } from './TestRouter';
import { TestRouter2 } from './TestRouter2';

const app = express.default();
const port = process.env.PORT || '3000';

const testMiddleWare = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    console.log('미들웨어 작동');
    next();
}

app.use('/test', testMiddleWare);
app.use('/route', TestRouter);
app.use('/route2', TestRouter2);

// test api

app.get('/test', (request, response, next) => {
    response.json({
        data: 'hello'
    });

    next();
})

app.get('/test2', (request, response, next) => {
    response.json({
        data: 'world'
    });

    next();
})

app.listen(port);