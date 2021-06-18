// {
//     "updateDate": "20210304",
//     "warningLevel": "1",
//     "type": "imp",
//     "componentName": "OBTExcelFormDialog",
//     "subject": "OBTExcelFormDialog 시트명을 따로 설정할 수 있도록 개선",
//     "jiraLink": "http://jira.duzon.com:8080/projects/EKLAGONEW/issues/EKLAGONEW-1280?filter=doneissues",
//     "notice": "isClose 속성을 true로 지정하였을시 OBTConfirm 컴포넌트 내부의 onCancel 이벤트를 중복 지정하지 마십시오.\nisClose속성과 onCancel이벤트가 중복 지정된다면, onCancel이벤트가 우선되기 때문에, isClose: true로 지정했다고 하더라도 해당 항목의 onClick 콜백함수는 실행되지 않습니다."
// },

import { Model, Sequelize, DataTypes } from "sequelize";

export interface IUpdateData {
    id: number,
    subject: string,
    warningLevel: string | UpdateWarningLevel,
    type: string | UpdateType,
    updateDate: string,
    componentName: string,
    notice?: string,
    jiraLink?: string,
    wikiLink?: string,
    detailLink?: string,
}

export enum UpdateWarningLevel {
    "LV1" = "1",
    "LV2" = "2",
    "LV3" = "3",
}

export enum UpdateType {
    /**
     * 버그
     */
    "bug" = "bug",
    /**
     * 문서, 예제 업데이트
     */
    'doc' = 'doc',
    /**
     * 폐기
     */
    'del' = 'del',
    /**
     * 새 컴포넌트
     */
    'new' = 'new',
    /**
     * 스타일 변경
     */
    'style' = 'style',
    /**
     * 기능 개선
     */
    'imp' = 'imp',
}

export class UpdateData extends Model { 
    mapToModel() {
        return {
            id: this.getDataValue('id'),
            subject: this.getDataValue('subject'),
            warningLevel: this.getDataValue('warningLevel'),
            type: this.getDataValue('type'),
            updateDate: this.getDataValue('updateDate'),
            componentName: this.getDataValue('componentName'),
            notice: this.getDataValue('notice'),
            jiraLink: this.getDataValue('jiraLink'),
            wikiLink: this.getDataValue('wikiLink'),
            detailLink: this.getDataValue('detailLink'),
        } as IUpdateData
    }
}

export default (sequelize: Sequelize) => {
    UpdateData.init({
        id: {
            type: DataTypes.INTEGER,
            field: 'ID',
            primaryKey: true,
            autoIncrement: true,
        },
        subject: {
            type: DataTypes.STRING,
            field: 'SUBJECT',
        },
        warningLevel: {
            type: DataTypes.STRING,
            field: 'WARNING_LEVEL',
        },
        type: {
            type: DataTypes.STRING,
            field: 'TYPE',
        },
        updateDate: {
            type: DataTypes.STRING,
            field: 'UPDATE_DATE',
        },
        componentName: {
            type: DataTypes.STRING,
            field: 'COMPONENT_NAME',
        },
        notice: {
            type: DataTypes.STRING,
            field: 'NOTICE',
            allowNull: true,
        },
        jiraLink: {
            type: DataTypes.STRING,
            field: 'JIRA_LINK',
            allowNull: true,
        },
        wikiLink: {
            type: DataTypes.STRING,
            field: 'WIKI_LINK',
        },
        detailLink: {
            type: DataTypes.STRING,
            field: 'DETAIL_LINK',
            allowNull: true,
        },
    }, { sequelize, tableName: 'UPDATE_DATA', timestamps: false, });
}