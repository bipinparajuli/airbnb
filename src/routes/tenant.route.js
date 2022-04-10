import { Router } from 'express'
import { getAllTenant,getTenant,getTenantById,searchTenant } from '../controllers/tenant.controller.js'


const tenantRoute = Router()

tenantRoute.param("tid",getTenantById)

tenantRoute.get('/getalltenant', getAllTenant)

tenantRoute.get('/searchtenant', searchTenant)


tenantRoute.get("/gettenantbyid/:tid",getTenant)


export default tenantRoute
