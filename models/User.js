const {Schema, model} = require('mongoose');

const schema = new Schema({
    "name": { type: String, required: true, unique: true },
    "accessLevel": { type: Number, required: true },
    "imageData": { type: Array, required: true },
    "faceId": { type: String, required: true },
    
    "faceParametres": { type: Array },
    "description": { type: String }
});

module.exports = model('User', schema);