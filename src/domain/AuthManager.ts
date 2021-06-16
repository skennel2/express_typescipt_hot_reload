import jwt from 'jsonwebtoken';

export const getAccessToken = (secret: string, loginId: string) => {
    return new Promise<String>((resolve, reject) => {
        jwt.sign(
            {
                value: loginId
            },
            secret,
            {
                expiresIn: '7d',
                issuer: 'velopert.com',
                subject: 'userInfo'
            }, (err, token) => {
                if (err || !token) {
                    reject();
                    return;
                }
                resolve(token);
            }
        )
    });
}

export const decodeToken = (secret: string, token?: string) => {
    if (!token) {
        throw new Error('decodeToken no token');
    }

    return new Promise<any>((resolve, reject) => {
        jwt.verify(String(token), secret, (error: any, decoded: any) => {
            if (error) {
                throw new Error(error);
            }

            resolve(decoded);
        })
    })

}