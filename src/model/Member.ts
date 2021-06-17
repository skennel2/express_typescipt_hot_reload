import { Sequelize, Model, DataTypes, Op } from 'sequelize'

export interface IMember {
    id: number
    loginId: string
    name: string
    password: string
    isAdmin?: string
}

export class Member extends Model {
    mapToModel() {
        return {
            id: this.getDataValue('id'),
            loginId: this.getDataValue('loginId'),
            name: this.getDataValue('name'),
            password: this.getDataValue('password'),
            isAdmin: this.getDataValue('isAdmin'),
        } as IMember
    }
}

export default (sequelize: Sequelize) => {
    Member.init({
        id: {
            type: DataTypes.INTEGER,
            field: 'ID',
            primaryKey: true,
            autoIncrement: true,
        },
        loginId: {
            type: DataTypes.STRING,
            field: 'LOGIN_ID',
        },
        name: {
            type: DataTypes.STRING,
            field: 'NAME',
        },
        password: {
            type: DataTypes.STRING,
            field: 'PASSWORD',
        },
        iaAdmin: {
            type: DataTypes.STRING,
            field: 'IS_ADMIN',
        },
    }, { sequelize, tableName: 'MEMBER', timestamps: false, });
}
