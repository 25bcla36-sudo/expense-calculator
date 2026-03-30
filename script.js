const form = document.getElementById("expense-form");
const list = document.getElementById("list");
const totalDisplay = document.getElementById("total");

let total = 0;
let chart;

const BASE_URL = "https://expense-backend-cbxa.onrender.com";

// load expenses
async function loadExpenses() {
    try {
        const res = await fetch(`${BASE_URL}/expenses`);
        const data = await res.json();

        list.innerHTML = "";
        total = 0;

        data.forEach((item, index) => {
            const li = document.createElement("li");

            li.innerHTML = `
                ${item.desc} - ₹${item.amount}
                <button onclick="deleteExpense(${index})">❌</button>
            `;

            list.appendChild(li);
            total += item.amount;
        });

        totalDisplay.textContent = total;

        const labels = data.map(item => item.desc);
        const amounts = data.map(item => item.amount);

        if (chart) chart.destroy();

        const ctx = document.getElementById("chart").getContext("2d");

        chart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    data: amounts
                }]
            }
        });

    } catch (err) {
        console.log("Error loading:", err);
    }
}

// add expense
form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const desc = document.getElementById("desc").value;
    const amount = parseInt(document.getElementById("amount").value);

    try {
        await fetch(`${BASE_URL}/expenses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ desc, amount })
        });

        form.reset();
        loadExpenses();
    } catch (err) {
        console.log("Error adding:", err);
    }
});

// delete expense
async function deleteExpense(index) {
    try {
        await fetch(`${BASE_URL}/expenses/${index}`, {
            method: "DELETE"
        });

        loadExpenses();
    } catch (err) {
        console.log("Error deleting:", err);
    }
}

// load on start
loadExpenses();