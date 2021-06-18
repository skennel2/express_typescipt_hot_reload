import express from "express"
import { UpdateData } from "../model/UpdateList"
import Sequelize from "sequelize"
const router = express.Router()
const Op = Sequelize.Op

router.get("/", async (request: express.Request, response: express.Response) => {
    try {
        const searchText = request.query.searchText
        const type = !request.query.type || String(request.query.type).toLowerCase() === 'all' ? null : request.query.type
        const warningLevel = !request.query.warningLevel || String(request.query.warningLevel).toLowerCase() === 'all' ? null : request.query.warningLevel
        const dateFrom = request.query.dateFrom
        const dateTo = request.query.dateTo
        const whereClaus = {} as any

        if (searchText) {
            whereClaus.subject = { [Op.like]: "%" + searchText + "%" }
        }

        if (type) {
            whereClaus.type = type
        }

        if (warningLevel) {
            whereClaus.warningLevel = warningLevel
        }

        if (dateFrom && dateTo) {
            whereClaus.updateDate = {
                [Op.between]: [dateFrom, dateTo]
            }
        }

        const list = await UpdateData.findAll({
            where: whereClaus,
        })

        response.json(list)
    } catch (error) {
        console.error(error)
        response.status(500).end()
    }
})

export default router