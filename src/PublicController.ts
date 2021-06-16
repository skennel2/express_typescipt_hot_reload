import express from "express";
import { MemberRepository } from "./Container";
import { getAccessToken } from "./domain/AuthManager";

const memberRepository = MemberRepository;
const router = express.Router();

router.post('/login', (request: express.Request, response: express.Response) => {
    const member = memberRepository.getByLoginId(request.body.loginId);
    if (!member) {
        responseFailAuthentication(response);
        return;
    } else if (member.password !== request.body.password) {
        responseFailAuthentication(response, '비밀번호가 일치하지 않습니다.');
        return;
    }

    getAccessToken(request.app.get('jwt-secret'), member.loginId).then((token) => {
        response
            .cookie('accessToken', token)
            .json({ message: 'success' });
    });
});

export function responseFailAuthentication(response: express.Response, message?: string) {
    response.status(403).json({
        message: message ? message : '인증 실패'
    });
}

// class PublicController {
//     private memberRepository : TestMemberRepository;
//     private router : Router;

//     constructor(router: Router, memberRepository: TestMemberRepository) {
//         this.router = express.Router();
//         this.memberRepository = memberRepository;
//         router.post('/login', this.login);
//     }

//     private login = (request: express.Request, response: express.Response) => {
//         const member = this.memberRepository.getByLoginId(request.body.loginId);

//         if (!member) {
//             response.status(403).json({
//                 message: '로그인 실패'
//             });
//             return;
//         }

//         getAccessToken(request.app.get('jwt-secret'), member.loginId).then((token) => {
//             response.json({
//                 loginId: member.loginId,
//                 accessToken: token
//             });
//         }).catch(err => {
//             response.status(500).json({
//                 message: err
//             });
//         })
//     }
// }

export const PublicContoller: express.Router = router;