import createHttpError from 'http-errors'
import formidable from "formidable"
import fs from 'fs'

import { sendToken } from '../utils/sendToken.js'
import UserModal from '../models/user.model.js'
import { catchAsync } from '../utils/catchAsync.js'
import { sendMail } from '../utils/mailer.js'


const signup = catchAsync(async (req, res, next) => {
  const form = new formidable.IncomingForm()


  form.parse(req, (err, fields, files) => {

    if (err) return next(createHttpError(400, 'Could not process image!!'))
    let { owner,tenant} = fields;
    console.log(owner);
    if(owner){

        fields.owner = JSON.parse(owner)
        console.log('hi',fields.owner);
        // JSON.parse(owner)
    
        const product = new UserModal(fields);
    
        if (files.images) {
          if (files.images.size > 2097152)
            return next(createHttpError(400, 'Image size exceeds 2mb!!'))
        //   console.log(files.images)
          product.owner.images.data = fs.readFileSync(files.images.filepath);
          product.owner.images.contentType = files.images.mimetype;
        console.log(product.owner.images.data);
        }
    
        // res.json()
    
        product.save((err, product) => {
            console.log(err);
          if (err) return next(createHttpError(400, 'Could not save user!!'));
          res.json(product);
        });
    }
    if(tenant){
        fields.tenant = JSON.parse(tenant)

        // JSON.parse(owner)
    
        const product = new UserModal(fields);
    console.log(product);
        if (files.images) {
          if (files.images.size > 2097152)
            return next(createHttpError(400, 'Image size exceeds 2mb!!'))
        //   console.log(files.images)
          product.tenant.profileDescription.images.data = fs.readFileSync(files.images.filepath);
          product.tenant.profileDescription.images.contentType = files.images.mimetype;
        // console.log(product.owner.images.data);
        }
    
        // res.json()
    
        product.save((err, product) => {
            console.log(err);
          if (err) return next(createHttpError(400, 'Could not save user!!'));
          res.json(product);
        });
    }
console.log("Exit");
   
  });
// console.log(req.body);

//     // const user = await UserModal.create(req.body)
//     res.status(201).json({
//         status: 'success',
//         data: {
//             // user,
//         },
//     })
})
export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(createHttpError(400, 'Please provide email and password'))
    }
    const user = await UserModal.findOne({ email }).select('+password')
    // check whether user with provided email exists or not
    if (!user) return next(createHttpError('400', 'Invalid credentials'))
    // check whether user's password matches the one provided
    if (!(await user.comparePassword(password)))
    {
    console.log(user);

        return next(createHttpError('400', 'Invalid credentials'))

    }
    // if all the credentials are valid, login the user
    sendToken(user.id, 'Logged in successfully', res, next)
})
export const requestPasswordReset = catchAsync(async (req, res, next) => {
    const { email } = req.body
    // check whether user with provided email exists or not
    const user = await UserModal.findOne({ email })
    if (!user) return next(createHttpError(404, 'User not found'))
    // if the user exists create a password reset token
    // set the token to expire in 10 minutes
    // send the url to reset password to the user's email
    const token = await user.createPasswordResetToken()
    try {
        await sendMail({
            to: user.email,
            subject: 'Reset your Password',
            text: `
            Please send a patch request to following url to reset your password
            http://localhost:4000/api/v1/users/reset-password/${token}
        `,
        })
    } catch (error) {
        return next(createHttpError(500, error.message))
    }
    res.status(200).json({
        status: 'success',
        data: {
            message: 'Email sent to reset password',
        },
    })
})
export const resetPassword = catchAsync(async (req, res, next) => {
    const { token } = req.params
    const { password, confirmPassword } = req.body

    const user = await UserModal.findOne({
        passwordResetToken: token,
        passwordResetTokenExpiresIn: { $gt: Date.now() },
    })
    if (!user) return next(createHttpError(404, 'Invalid or expired token'))
    if (password !== confirmPassword)
        return next(createHttpError(400, 'Passwords do not match'))
    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetTokenExpiresIn = undefined

    await user.save({ validateModifiedOnly: true })
    res.json({
        data: { message: 'Password changed successfully' },
    })
})

export { signup }
