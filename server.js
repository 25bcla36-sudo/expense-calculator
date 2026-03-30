const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// GET expenses
app.get("/expenses", (req, res) => {
    try {
        const data = fs.readFileSync("data.json");
        res.json(JSON.parse(data));
    } catch {
        res.json([]);
    }
});

// ADD expense
app.post("/expenses", (req, res) => {
    const { desc, amount } = req.body;

    let data = [];

    try {
        data = JSON.parse(fs.readFileSync("data.json"));
    } catch {}

    data.push({ desc, amount });

    fs.writeFileSync("data.json", JSON.stringify(data));

    res.json({ message: "Saved" });
});

// DELETE expense
app.delete("/expenses/:index", (req, res) => {
    const index = req.params.index;

    let data = [];

    try {
        data = JSON.parse(fs.readFileSync("data.json"));
    } catch {}

    data.splice(index, 1);

    fs.writeFileSync("data.json", JSON.stringify(data));

    res.json({ message: "Deleted" });
});

// PORT FIX FOR RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});