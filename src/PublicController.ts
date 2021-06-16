import express from "express";
import { TestMemberRepository } from "./domain/TestMemberRepository";
import { MemberRepository } from "./Container";
import { getAccessToken } from "./domain/AuthManager";

const memberRepository = MemberRepository;

const router = express.Router();

router.post('/login', (request: express.Request, response: express.Response) => {
    const member = memberRepository.getByLoginId(request.body.loginId);

    if (!member) {
        response.status(403).json({
            message: '로그인 실패'
        });
        return;
    }

    getAccessToken(request.app.get('jwt-secret'), member.loginId).then((token) => {
        response.json({
            loginId: member.loginId,
            accessToken: token
        });
    }).catch(err => {
        response.status(500).json({
            message: err
        });
    })
});

export const PublicContoller: express.Router = router;