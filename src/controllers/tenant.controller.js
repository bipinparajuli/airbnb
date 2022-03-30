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