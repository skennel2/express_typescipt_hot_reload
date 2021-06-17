import express from "express";
import { getAccessToken } from "../TokenManager";
import { Member, IMember } from "../model/Member";

const router = express.Router();

router.post('/login', async (request: express.Request, response: express.Response) => {
    const memberModel = await Member.findOne({
        where: {
            loginId: request.body.loginId
        } as Partial<IMember>
    })

    let member: IMember | null = null;
    if (memberModel !== null) {
        member = memberModel.mapToModel();
    }

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

export default router;