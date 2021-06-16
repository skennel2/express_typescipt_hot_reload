import { Router, Request, Response } from "express";

const router = Router();

router.get('/test', (request: Request, response: Response) => {
    console.log(request.session)
    response.json({
        data: 'router data'
    })
});

export const TestRouter: Router = router;