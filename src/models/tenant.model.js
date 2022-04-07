import pkg from 'mongoose';
import { CommonRoomDetails } from './common.data.js'

const {Schema} = pkg;

export const TenantSchema = new Schema({
    occupation: {
        type: String,
        enum: ['Student', 'Employeed', 'Retired', 'Other'],
        required: [true, 'Occupation is required'],
    },
    preferredRooms: {
        ...CommonRoomDetails,
        availableWithin: {
            type: Date,
            required: [true, 'Available within is required'],
        },
        roomLocation: {
            type: String,
            enum: [
                'Kathmandu',
                'Bhaktapur',
                'Lalitpur',
                'Patan',
                'Boudha',
                'Baneshwor',
                'Pepsicola',
                'Kirtipur',
            ],
            required: [true, 'Room location is required'],
        },
    },
    profileDescription: {
        bio: {
            type: String,
            required: [true, 'Bio is required'],
        },
        images: {
            data: Buffer,
        // type:Buffer,
        contentType: String
        },
    },
})

const TenantModal = pkg.model('Tenant', TenantSchema)

export default TenantModal