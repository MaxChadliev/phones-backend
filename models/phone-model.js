const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhoneSchema = new Schema({
        brand: { 
            type: String, 
            required: true 
        },
        name: { 
            type: String 
        },
        color: { 
            type: String 
        },
        image: { 
            type: String 
        },
        owner: { 
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        } 
    },
    {
        timestamps: true
    }
);

const Phone =mongoose.model('Phone', PhoneSchema);

module.exports = Phone;
