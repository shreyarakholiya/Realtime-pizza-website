const mongoose = require("mongoose");

const menuSchema = mongoose.Schema({
    name : {
        type:String,
        required:true,
    },
    image : {
        type:String,
    },
    price : {
        type:Number,
        required:true,
    },
    size : {
        type:String,
        required:true,
    }

})

module.exports = mongoose.model('Menu',menuSchema);