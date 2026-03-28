const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// get all expenses
app.get("/expenses", (req, res) => {
    const data = fs.readFileSync("data.json");
    res.json(JSON.parse(data));
});

// add expense
app.post("/expenses", (req, res) => {
    const { desc, amount } = req.body;

    const data = JSON.parse(fs.readFileSync("data.json"));

    const newExpense = { desc, amount };
    data.push(newExpense);

    fs.writeFileSync("data.json", JSON.stringify(data));

    res.json({ message: "Saved" });
});

// delete expense
app.delete("/expenses/:index", (req, res) => {
    const index = req.params.index;

    const data = JSON.parse(fs.readFileSync("data.json"));

    data.splice(index, 1);

    fs.writeFileSync("data.json", JSON.stringify(data));

    res.json({ message: "Deleted" });
});

// start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});