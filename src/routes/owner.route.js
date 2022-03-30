import { Router } from 'express'
import { getPhoto,getAllRoom,getRoom,getUserByID,searchRoom,getRoomById } from '../controllers/owner.controller.js'

const ownerRoute = Router()

ownerRoute.param("id",getUserByID)
ownerRoute.param("rid",getRoomById)


ownerRoute.get('/getallrooms', getAllRoom)

ownerRoute.get("/hello/:rid",getRoom)

ownerRoute.get('/searchrooms', searchRoom)

ownerRoute.get('/getphoto/:id', getPhoto)



export default ownerRoute
