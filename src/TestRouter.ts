import { Router, Request, Response, NextFunction } from "express";

const router = Router();

router.get('/test', (request: Request, response: Response) => {
    response.json({
        data: 'router data'
    })
});

export const TestRouter: Router = router;