import { IMember, Member } from "./Member";

export class TestMemberRepository {
    public getAll = async () => {
        const members = await Member.findAll();
        return members.map(member => member.mapToModel());
    };

    public getById = async (id: number) => {
        const member = await Member.findOne({
            where: {
                id: id
            }
        });

        if (member === null) {
            return null;
        }

        return member.mapToModel();
    };

    public getByLoginId = async (loginId: string) => {
        const member = await Member.findOne({
            where: {
                loginId: loginId
            },
            mapToModel: true,
        });
        if (member === null) {
            return null;
        }
        return member.mapToModel();
    };
}
