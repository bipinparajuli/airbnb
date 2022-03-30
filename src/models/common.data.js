export const CommonRoomDetails = {
    roomType: {
        type: String,
        enum: ['Single', 'Double'],
        required: [true, 'Room type is required'],
    },
    rentPerMonth: {
        type: Number,
        min: [0, 'Rent per month cannot be negative'],
        max: [15000, 'Rent per month cannot be more than 15000'],
        required: [true, 'Rent per month is required'],
    },
    rentDuration: {
        type: String,
        enum: ['Under 6 months', 'More than 6 months', 'Unlimited'],
        required: [true, 'Rent duration is required'],
    },
}
