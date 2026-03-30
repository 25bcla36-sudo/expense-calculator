const form = document.getElementById("expense-form");
const list = document.getElementById("list");
const totalDisplay = document.getElementById("total");

let total = 0;
let chart;

// load expenses
async function loadExpenses() {
    const res = await fetch("https://expense-backend-cbxa.onrender.com");
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

    // chart data
    const labels = data.map(item => item.desc);
    const amounts = data.map(item => item.amount);

    if (chart) {
        chart.destroy();
    }

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
}

// add expense
form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const desc = document.getElementById("desc").value;
    const amount = parseInt(document.getElementById("amount").value);

    await fetch("https://expense-backend-cbxa.onrender.com", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ desc, amount })
    });

    form.reset();
    loadExpenses();
});

// delete expense
async function deleteExpense(index) {
    await fetch(`https://expense-backend-cbxa.onrender.com/${index}`, {
        method: "DELETE"
    });

    loadExpenses();
}

// load on start
loadExpenses();