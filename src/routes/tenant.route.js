import { Router } from 'express'
import { getAllTenant,getTenant,getTenantById } from '../controllers/tenant.controller.js'


const tenantRoute = Router()

tenantRoute.param("tid",getTenantById)

tenantRoute.get('/getalltenant', getAllTenant)

tenantRoute.get("/gettenantbyid/:tid",getTenant)


export default tenantRoute
