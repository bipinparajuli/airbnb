import createHttpError from 'http-errors'
import formidable from "formidable"

import { catchAsync } from '../utils/catchAsync.js'
import UserModal from '../models/user.model.js'


export const getAllRoom = catchAsync(async (req, res, next) => {
    const room = await UserModal.find({},{owner:2})
    let result = room.filter(data=> data.owner)
    console.log(result);

    return res.send(result) 
})

export const getRoom = catchAsync(async (req, res, next) => {
  console.log("single");
  return res.send(req.room)
})

export const searchRoom = catchAsync(async (req, res, next) => {
    const searchParams = req.query;
    const room = await UserModal.find({'owner.roomAddress.district':searchParams.location},{owner:1})
    // .where({owner:{roomAddress:{district:searchParams.location}}})
    return res.send(room) 
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

  export const updateOwner = (req,res) => {
    const form = new formidable.IncomingForm()


    form.parse(req, (err, fields, files) => {
    
      if(err)console.log(err)

      // console.log(fields);

      let r = JSON.parse(fields.owner)

      // console.log(req.profile.owner,r);
   let new_owner = ({r,...req.profile.owner})
console.log(new_owner);
    res.send(new_owner)
    })

  }