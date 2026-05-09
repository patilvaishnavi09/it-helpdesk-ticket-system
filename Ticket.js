const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
    title: String,
    description: String,
    priority: String,
    status: {
        type: String,
        default: "Open"
    }
});

module.exports = mongoose.model("Ticket", TicketSchema);