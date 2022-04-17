import createHttpError from 'http-errors'
import formidable from "formidable"
import fs from 'fs'

import { catchAsync } from '../utils/catchAsync.js'
import UserModal from '../models/user.model.js'
import OwnerModal from '../models/owner.model.js'
import TenantModal from '../models/tenant.model.js'



export const getAllRoom = catchAsync(async (req, res, next) => {
    const room = await UserModal.find({},{owner:2})
    const ownerroom = await OwnerModal.find({owner:1});
    // console.log(ownerroom);
    let r = ownerroom.map(data=>{
      // console.log(data);
      return{
        _id:data._id,
        owner:data
      
      }
      
    })

    let result = room.filter(data=> data.owner)
    result=[...result,...r]
    // console.log(result);
    

    return res.send(result) 
})

export const getRoom = catchAsync(async (req, res, next) => {
  console.log("single");
  return res.send(req.room)
})

export const searchRoom = catchAsync(async (req, res, next) => {
    const searchParams = req.query;
    console.log(searchParams);
    let room;
    let ownerroom;
    if(searchParams.location){
       room = await UserModal.find({'owner.roomAddress.district':searchParams.location},{owner:1}) 
       if(room.length <= 0){
        room = await UserModal.find({'owner.roomAddress.area':searchParams.location},{owner:1})
      }
  
       ownerroom = await OwnerModal.find({'roomAddress.district':searchParams.location},{})
      if(ownerroom.length <= 0){
       ownerroom = await OwnerModal.find({'roomAddress.area':searchParams.location},{})
      
      }
    }

    // for price

    if(searchParams.price){
      console.log(searchParams.price);
      if(searchParams.price == "cheapest"){

        room = await UserModal.find({},{owner:1}).sort({'owner.roomDetails.rentPerMonth':1}) 
        
        room = room.filter(data=>{
          if(data.owner){
            return data
          }
        })
         ownerroom = await OwnerModal.find({},{}).sort({'owner.roomDetails.rentPerMonth':1})
      
       
      }

     //expensive price

     if(searchParams.price == "expensive"){

      room = await UserModal.find({},{owner:1}).sort({'owner.roomDetails.rentPerMonth':-1}) 
      // if(room.length <= 0){
      //   room = await UserModal.find({},{owner:1}).sort({'owner.roomDetails.rentPerMonth':-1})
      // }
      room = room.filter(data=>{
        if(data.owner){
          return data
        }
      })
  
      // console.log(room);
  
       ownerroom = await OwnerModal.find({},{}).sort({'owner.roomDetails.rentPerMonth':-1})
      // if(ownerroom.length <= 0){
      //  ownerroom = await OwnerModal.find({},{}).sort({'owner.roomDetails.rentPerMonth':-1})
      
      // }
     
    }


   }

   //for preference gender

   if(searchParams.preference){

    if(searchParams.preference == "male"){
      room = await UserModal.find({'owner.tenantPreference':searchParams.preference},{owner:1}) 
   

      ownerroom = await OwnerModal.find({'tenantPreference':searchParams.preference},{})
   
    }
    if(searchParams.preference == "female"){
      room = await UserModal.find({'owner.tenantPreference':searchParams.preference},{owner:1}) 
   

      ownerroom = await OwnerModal.find({'tenantPreference':searchParams.preference},{})
  
    }
    if(searchParams.preference == "family"){
      room = await UserModal.find({'owner.tenantPreference':searchParams.preference},{owner:1}) 
   

      ownerroom = await OwnerModal.find({'tenantPreference':searchParams.preference},{})
 
    }
    

   
  }
  
  // For Duration
  if(searchParams.duration){
    if(searchParams.duration == "short"){
      room = await UserModal.find({'owner.roomDetails.rentDuration':"Under 6 months"},{owner:1}) 
   

      ownerroom = await OwnerModal.find({'roomDetails.rentDuration':"Under 6 months"},{})
   
    }
    if(searchParams.duration == "long"){
      room = await UserModal.find({'owner.roomDetails.rentDuration':"More than 6 months"},{owner:1}) 
   

      ownerroom = await OwnerModal.find({'roomDetails.rentDuration':"More than 6 months"},{})
   
    }
  }
    // console.log(room,ownerroom);

    let r = ownerroom.map(data=>{
      // console.log(data);
      return{
        owner:data
      
      }
      
    })


let  result=[...room,...r]
    
    // console.log(r);
    // .where({owner:{roomAddress:{district:searchParams.location}}})
    return res.send(result) 
})

export const getPhoto = catchAsync(async (req, res, next) => {
  
  // console.log(req.profile.images);

  if (req.profile.owner !== undefined && req.profile.owner.images ) {

    //   res.set("status", 200);
      res.set("Content-Type", req.profile.owner.images.contentType);
      return res.status(200).send(req.profile.owner.images.data);
    }

    if (req.profile.tenant){
      res.set("Content-Type", req.profile.tenant.profileDescription.images.contentType);
      return res.status(200).send(req.profile.tenant.profileDescription.images.data);
    }
    else{
      res.set("Content-Type", req.profile.images.contentType);
      return res.status(200).send(req.profile.images.data);
    }
    // next();
  });

  export const getRoomById = async (req, res, next, id) => {
   let room =[]
   room = await UserModal.find({"owner._id":id})
   console.log(room.length);

   if(room.length > 0){
    req.room = room[0].owner;

   }

      if ( !room || room.length <=0){
        room = await OwnerModal.findById(id)
        console.log(room);
        req.roommodel = room
      } 
      if ( !room || room.length <=0){
      
      return next(createHttpError(500, 'Room not found'))
      }
      next();
  };

  export const getUserByID = async (req, res, next, id) => {
    //   console.log(id);
    let user = await UserModal.findById(id)
    // , (err, user) => {
        // console.log(user,err);
        // console.log(user);
        if (!user || user == null){
          user = await OwnerModal.findById(id)
        } 

        if (!user || user == null){
          user = await TenantModal.findById(id)
        } 
        if (!user || user == null){
          user = await UserModal.find({"tenant._id":id})
        } 
        console.log(user);

      if (!user){
        next(createHttpError(500, 'User not found'))

      } 

      req.profile = user;
      next();
    // });
  };

  export const updateOwner = (req,res,next) => {
    const form = new formidable.IncomingForm()


  form.parse(req, (err, fields, files) => {
    console.log('hi',files);

    if (err) return next(createHttpError(400, 'Could not process image!!'))
    let { owner} = fields;
    if(owner){

        fields.owner = JSON.parse(owner)
        // JSON.parse(owner)
        // console.log(fields.owner);

        fields.owner.images =""
        const product = new OwnerModal(fields.owner);

        console.log(product);

        // product.owner.images = ""
    
        if (files.images) {
          if (files.images.size > 2097152)
            return next(createHttpError(400, 'Image size exceeds 2mb!!'))
        //   console.log(files.images)
          product.images.data = fs.readFileSync(files.images.filepath);
          product.images.contentType = files.images.mimetype;
        console.log(product.images.data);
        }
    
        console.log(product);
        // res.json()
    
        product.save((err, product) => {
            console.log(err);
          if (err) return next(createHttpError(400, 'Could not save user!!'));
          res.json(product);
        });
    }

  })
}
  
export const deleteRoom = catchAsync(async (req, res, next) =>{
  console.log(req.room);
  if(req.room){
 let user =  await UserModal.updateOne({"owner._id":req.room._id},{$unset:{owner:""}})
    return res.status(200).send("Room deleted succesfully");
  }

  if(req.room == undefined && req.roommodel){
    OwnerModal.deleteOne({_id:req.roommodel._id},(err,data)=>{
      console.log(data);
      if (err) return next(createHttpError(400, 'Could not delete room!!'))

        else return res.status(200).send("Room deleted succesfully");
    })
  }


  // UserModal.update({}, {$unset: {pi: 1}})(req.room._id, (err, room) => {
  //   console.log(room);
    
  //   if (err) return next(createHttpError(400, 'Could not delete room!!'))

  //   else return res.status(200).send("Room deleted succesfully");
  // });

})