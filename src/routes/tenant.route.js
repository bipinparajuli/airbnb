import { Router } from 'express'
import { getProfile,getAllTenant,getTenant,getTenantById,searchTenant,deleteTenant } from '../controllers/tenant.controller.js'


const tenantRoute = Router()

tenantRoute.param("tid",getTenantById)

tenantRoute.get('/getalltenant', getAllTenant)

tenantRoute.get('/searchtenant', searchTenant)

tenantRoute.get('/profile/:ids', getProfile)

tenantRoute.delete("/delete-tenant/:tid",deleteTenant)


tenantRoute.get("/gettenantbyid/:tid",getTenant)


export default tenantRoute
