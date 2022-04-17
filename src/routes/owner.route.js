import { Router } from 'express'
import { getPhoto,getAllRoom,getRoom,getUserByID,searchRoom,getRoomById, updateOwner,deleteRoom } from '../controllers/owner.controller.js'

const ownerRoute = Router()

ownerRoute.param("id",getUserByID)
ownerRoute.param("rid",getRoomById)


ownerRoute.get('/getallrooms', getAllRoom)

ownerRoute.get("/hello/:rid",getRoom)

ownerRoute.delete("/deleteroom/:rid",deleteRoom)

ownerRoute.get('/searchrooms', searchRoom)

ownerRoute.get('/getphoto/:id', getPhoto)

ownerRoute.put('/update', updateOwner)




export default ownerRoute
