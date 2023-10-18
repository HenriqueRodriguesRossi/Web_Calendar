const mongoose = require("mongoose")

const EventSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    date_of_event:{
        type: Date,
        required: true
    },
    init_time:{
        type: String,
        required: true
    },
    end_time:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    created_at:{
        type: Date,
        default: Date().now
    }
})

module.exports = mongoose.model("Event", EventSchema)