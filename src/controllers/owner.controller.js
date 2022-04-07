import createHttpError from 'http-errors'
import formidable from "formidable"
import fs from 'fs'

import { catchAsync } from '../utils/catchAsync.js'
import UserModal from '../models/user.model.js'
import OwnerModal from '../models/owner.model.js'


export const getAllRoom = catchAsync(async (req, res, next) => {
    const room = await UserModal.find({},{owner:2})
    const ownerroom = await OwnerModal.find({owner:1});
    // console.log(ownerroom);
    let r = ownerroom.map(data=>{
      // console.log(data);
      return{
        owner:data
      
      }
      
    })

    let result = room.filter(data=> data.owner)
    result=[...result,...r]
    console.log(result);
    

    return res.send(result) 
})

export const getRoom = catchAsync(async (req, res, next) => {
  console.log("single");
  return res.send(req.room)
})

export const searchRoom = catchAsync(async (req, res, next) => {
    const searchParams = req.query;
    let room = await UserModal.find({'owner.roomAddress.district':searchParams.location},{owner:1}) 
    if(room.length <= 0){
      room = await UserModal.find({'owner.roomAddress.area':searchParams.location},{owner:1})
    }

    let ownerroom = await OwnerModal.find({'roomAddress.district':searchParams.location},{})
    if(ownerroom.length <= 0){
     ownerroom = await OwnerModal.find({'roomAddress.area':searchParams.location},{})
    
    }

    let r = ownerroom.map(data=>{
      // console.log(data);
      return{
        owner:data
      
      }
      
    })

let  result=[...room,...r]
    
    console.log(result);
    // .where({owner:{roomAddress:{district:searchParams.location}}})
    return res.send(result) 
})

export const getPhoto = catchAsync(async (req, res, next) => {
    if (req.profile.owner.images) {
    //   res.set("status", 200);
      res.set("Content-Type", req.profile.owner.images.contentType);
      return res.status(200).send(req.profile.owner.images.data);
    }
    next();
  });

  export const getRoomById = (req, res, next, id) => {
    //   console.log(id);
    UserModal.find({"owner._id":id},(err, room) => {
      console.log(err,room);
      if (err || !room) next(createHttpError(500, 'Room not found'))

      req.room = room[0].owner;
      next();
    });
  };

  export const getUserByID = (req, res, next, id) => {
    //   console.log(id);
    UserModal.findById(id, (err, user) => {
        // console.log(user,err);
      if (err || !user) next(createHttpError(500, 'User not found'))

      req.profile = user;
      next();
    });
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

    
        const product = new OwnerModal(fields.owner);
    
        if (files.images) {
          if (files.images.size > 2097152)
            return next(createHttpError(400, 'Image size exceeds 2mb!!'))
        //   console.log(files.images)
          product.owner.images.data = fs.readFileSync(files.images.filepath);
          product.owner.images.contentType = files.images.mimetype;
        console.log(product.owner.images.data);
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
  