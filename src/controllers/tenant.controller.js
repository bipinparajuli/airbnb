import createHttpError from 'http-errors'

import { catchAsync } from '../utils/catchAsync.js'
import UserModal from '../models/user.model.js'



export const getAllTenant = catchAsync(async (req, res, next) => {
    const tenant = await UserModal.find({},{tenant:1})
    let result = tenant.filter(data=> data.tenant)

    return res.send(result) 
})

export const getTenantById = (req, res, next, id) => {
    //   console.log(id);
    UserModal.find({"tenant._id":id},(err, room) => {
      console.log(err,room);
      if (err || !room) next(createHttpError(500, 'Room not found'))

      req.tenant = room[0].tenant;
      next();
    });
  };

  export const getTenant = catchAsync(async (req, res, next) => {
    console.log("single");
    return res.send(req.tenant)
  })

  export const searchTenant = catchAsync(async (req, res, next) => {
    const searchParams = req.query;
let room;
console.log(searchParams.price);
    if(searchParams.price){
     room = await UserModal.find({},{tenant:1}) 
     console.log("Tenant",room);
   
    }else{
       room = await UserModal.find({'tenant.preferredRooms.roomLocation':searchParams.location},{tenant:1}) 
       console.log("Tenant",room);

    }

    // if(room.length <= 0){
    //   room = await UserModal.find({'owner.roomAddress.area':searchParams.location},{owner:1})
    // }

    // let ownerroom = await OwnerModal.find({'roomAddress.district':searchParams.location},{})
    // if(ownerroom.length <= 0){
    //  ownerroom = await OwnerModal.find({'roomAddress.area':searchParams.location},{})
    
    // }

    // let r = ownerroom.map(data=>{
    //   // console.log(data);
    //   return{
    //     owner:data
      
    //   }
      
    // })

let  result=[...room]
    
    // .where({owner:{roomAddress:{district:searchParams.location}}})
    return res.send(result) 
})

export const deleteTenant = catchAsync(async (req, res, next) =>{
  console.log("req.tenant");
  if(req.tenant){
 let user =  await UserModal.updateOne({"tenant._id":req.tenant._id},{$unset:{tenant:""}})
    return res.status(200).send("Tenant deleted succesfully");
  }
})