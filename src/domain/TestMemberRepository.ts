import { IMember } from "./IMember";

export class TestMemberRepository {
    private members: IMember[] = [
        {
            id: '1',
            loginId: 'skennel',
            name: '나윤수',
            password: '1234',
            iaAdmin: true
        },
        {
            id: '2',
            loginId: 'gaeko14',
            name: '나진수',
            password: '6565',
        },
        {
            id: '3',
            loginId: 'test11',
            name: '김윤미',
            password: '1111aaaa',
        }
    ];


    public getAll = () => {
        return this.members;
    };

    public getById = (id: string) => {
        return this.members.find(item => item.id === id) || null;
    };

    public getByLoginId = (loginId: string) => {
        return this.members.find(item => item.loginId === loginId) || null;
    };
}
