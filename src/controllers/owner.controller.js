import createHttpError from 'http-errors'
import formidable from "formidable"
import fs from 'fs'
import AWS from 'aws-sdk'


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
  req.room.images == undefined
  console.log("single",req.room.images );

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
  

  if (req.profile.tenant){
    console.log(3);

    res.set("Content-Type", req.profile.tenant.profileDescription.images.contentType);
    return res.status(200).send(req.profile.tenant.profileDescription.images.data);
  }

  if (req.profile.owner !== undefined && req.profile.owner.images ) {
console.log(1);
    //   res.set("status", 200);
      res.set("Content-Type", req.profile.owner.images.contentType);
      return res.status(200).send(req.profile.owner.images.data);
    }
    if (req.profile[0].owner ) {
      console.log(2);

      //   res.set("status", 200);
      res.set("Content-Type", req.profile[0].owner.images.contentType);
      return res.status(200).send(req.profile[0].owner.images.data);
      }
      if (req.profile[0].tenant ) {
        // console.log(2);
        // console.log("PROFILE",req.profile[0].tenant);
  
        //   res.set("status", 200);
        res.set("Content-Type", req.profile[0].tenant.profileDescription.images.contentType);
        return res.status(200).send(req.profile[0].tenant.profileDescription.images.data);
        }
   
    else{
      console.log(4);

      res.set("Content-Type", req.profile.images.contentType);
      return res.status(200).send(req.profile.images.data);
    }
    // next();
  });

  export const getRoomById = async (req, res, next, id) => {
   let room =[]
  //  console.log(id);
   room = await UserModal.find({"owner._id":id})

   if(room.length > 0){
    // room[0] = {owner:{name:room.fullName,email:room.email}}

    req.room = room[0].owner;
    // console.log("J",req.room.photoId);


   }

      if ( !room || room.length <=0){
        room = await OwnerModal.findById(id)
        console.log(room);
    //     room={
    //       photoId : id
    //     }
    //  console.log("I",room.photoId);

        req.room = room
        req.roommodel = room
      } 
      if ( !room || room.length <=0){
      
      return next(createHttpError(500, 'Room not found'))
      }
      next();
  };

  export const getUserByID = async (req, res, next, id) => {
      console.log(id);
    let user = await UserModal.findById(id)

  

    // , (err, user) => {
        // console.log(user,err);
        // console.log(user);

        if (!user | user == null){
          user = await UserModal.find({"owner._id":id})

        } 

        if (!user | user == null){

          user ={
            owner: await OwnerModal.findById(id)
          } 
        } 

        if (!user | user == null | user == null){

          user = await TenantModal.findById(id)

        } 
        console.log("USER",user);

        if (!user | user == null | user.length == 0){

          user = await UserModal.find({"tenant._id":id})

        } 
       

      if (!user){
        next(createHttpError(500, 'User not found'))

      } 
      // console.log("HI",user);

      req.profile = user;
      next();
    // });
  };

  export const updateOwner = (req,res,next) => {
    const form = new formidable.IncomingForm()


  form.parse(req, async(err, fields, files) => {
    console.log('hi',files);

    if (err) return next(createHttpError(400, 'Could not process image!!'))
    let { owner} = fields;
    if(owner){
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      })
        fields.owner = JSON.parse(owner)
        // JSON.parse(owner)
        // console.log(fields.owner);

        fields.owner.images =""
        const product = new OwnerModal(fields.owner);


        // product.owner.images = ""
    
        if (files.images) {
          if (files.images.size > 2097152)
            return next(createHttpError(400, 'Image size exceeds 2mb!!'))
        //   console.log(files.images)
          const blob = fs.readFileSync(files.images.filepath);
          const uploadedImage = await s3.upload({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: files.images.originalFilename,
            Body: blob,
            ACL: 'public-read'
          }).promise()
          product.images = uploadedImage.Location;

        }
    
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

  if(req.room && req.roommodel){
    OwnerModal.deleteOne({_id:req.roommodel._id},(err,data)=>{
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