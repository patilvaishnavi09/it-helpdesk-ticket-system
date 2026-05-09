const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Ticket = require("./models/Ticket");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.post("/create-ticket", async (req, res) => {
    try {
        const ticket = new Ticket(req.body);
        await ticket.save();
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/tickets", async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put("/update-ticket/:id", async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.delete("/delete-ticket/:id", async (req, res) => {
    try {
        await Ticket.findByIdAndDelete(req.params.id);
        res.json({ message: "Ticket deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});