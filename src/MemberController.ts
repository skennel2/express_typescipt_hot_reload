import express from "express";
import { TestMemberRepository } from "./domain/TestMemberRepository";
import { MemberRepository } from "./Container";

const memberRepository = MemberRepository;

const router = express.Router();

router.get('/', (request: express.Request, response: express.Response) => {
    response.json({
        data: memberRepository.getAll()
    });
});

router.get('/getall', async (request: express.Request, response: express.Response) => {
    response.json({
        data: await memberRepository.getAll()
    });
});

router.get('/:id', async (request: express.Request, response: express.Response) => {
    response.json({
        data: await memberRepository.getById(Number(request.params.id))
    });
});
export const MemberRouter: express.Router = router;