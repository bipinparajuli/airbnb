import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { OwnerSchema } from './owner.model.js'
import { TenantSchema } from './tenant.model.js'

const UserSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required'],
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
    },
    phoneNumber: {
        validate: {
            validator: function (phoneNumber) {
                return validator.isMobilePhone(phoneNumber, 'ne-NP')
            },
            message: '{VALUE} is not a valid phone number!',
        },
        type: String,
        required: [true, 'Phone number is required'],
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: [true, 'Gender is required'],
    },
    email: {
        validate: {
            validator: validator.isEmail,
            message: 'Enter a valid email address',
        },
        type: String,
        unique: true,
        required: [true, 'Email is required'],
    },
    password: {
        // validate: {
        //     validator: validator.isStrongPassword,
        //     message:
        //         'Password must be at least 8 characters long and contain at least one number, one uppercase and one lowercase letter',
        // },
        type: String,
        required: [true, 'Password is required'],
    },
    passwordResetToken: String,
    passwordResetTokenExpiresIn: Date,
    role:{
        type:String,
        default:"other",
        required: [true, 'Role is required'],
    },
    status:{
        type:String,
        default:"pending"
    },
    tenant: {
        type: TenantSchema,
    },
    owner: {
        type: OwnerSchema,
    },
})
UserSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 12)
    next()
})
UserSchema.methods.createPasswordResetToken = async function () {
    this.passwordResetToken = nanoid()
    // token expires after 10 minutes
    this.passwordResetTokenExpiresIn = new Date(Date.now() + 10 * 60 * 1000)
    await this.save({ validateModifiedOnly: true })
    return this.passwordResetToken
}
UserSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password)
}
const UserModal = mongoose.model('User', UserSchema)

export default UserModal
