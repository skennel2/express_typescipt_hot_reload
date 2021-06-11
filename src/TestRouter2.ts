import { Router, Request, Response, NextFunction } from "express";

const router = Router();

router.get('/test', (request: Request, response: Response) => {
    response.json({
        data: 'router data2'
    })
});

export const TestRouter2: Router = router;