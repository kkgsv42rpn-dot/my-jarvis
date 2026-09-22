// ============================
// JARVIS DATA
// ============================

let events =
    JSON.parse(localStorage.getItem("jarvisEvents")) || [];

let tasks =
    JSON.parse(localStorage.getItem("jarvisTasks")) || [];

let expenses =
    JSON.parse(localStorage.getItem("jarvisExpenses")) || [];

let budget =
    Number(localStorage.getItem("jarvisBudget")) || 0;


// ============================
// SAVE DATA
// ============================

function saveData() {

    localStorage.setItem(
        "jarvisEvents",
        JSON.stringify(events)
    );

    localStorage.setItem(
        "jarvisTasks",
        JSON.stringify(tasks)
    );

    localStorage.setItem(
        "jarvisExpenses",
        JSON.stringify(expenses)
    );

    localStorage.setItem(
        "jarvisBudget",
        budget
    );
}


// ============================
// CALENDAR
// ============================

function addEvent() {

    const eventName =
        prompt("What is the event?");

    if (!eventName) return;

    const eventDate =
        prompt("When is it?");

    events.push({

        name: eventName,

        date: eventDate

    });

    saveData();

    displayEvents();
}


function displayEvents() {

    const container =
        document.getElementById("calendarEvents");

    if (events.length === 0) {

        container.innerHTML =
            "<p>No events yet.</p>";

        return;
    }

    container.innerHTML =
        events.map(event => `

            <p>
                <strong>${event.name}</strong>
                <br>
                ${event.date}
            </p>

        `).join("");
}


// ============================
// EXPENSES
// ============================

function addExpense() {

    const amount =
        Number(prompt("How much did you spend?"));

    if (!amount || amount <= 0) return;

    const description =
        prompt("What was it for?");

    expenses.push({

        amount: amount,

        description:
            description || "Expense"

    });

    saveData();

    displayMoney();
}


function displayMoney() {

    const total =
        expenses.reduce(

            (sum, expense) =>
                sum + expense.amount,

            0
        );

    document.getElementById("spent")
        .innerText =
        "$" + total.toFixed(2);

    document.getElementById("budget")
        .innerText =
        "$" + budget.toFixed(2);
}


// ============================
// TASKS
// ============================

function addTask() {

    const task =
        prompt("What do you need to do?");

    if (!task) return;

    tasks.push(task);

    saveData();

    displayTasks();
}


function displayTasks() {

    const container =
        document.getElementById("tasks");

    if (tasks.length === 0) {

        container.innerHTML =
            "<p>No tasks yet.</p>";

        return;
    }

    container.innerHTML =
        tasks.map((task, index) => `

            <p>
                <input
                    type="checkbox"
                    onchange="completeTask(${index})"
                >

                ${task}
            </p>

        `).join("");
}


function completeTask(index) {

    tasks.splice(index, 1);

    saveData();

    displayTasks();
}


// ============================
// JARVIS CHAT
// ============================

function sendMessage() {

    const input =
        document.getElementById("userInput");

    const text =
        input.value.trim();

    if (!text) return;

    addMessage(text, "user");

    input.value = "";

    setTimeout(() => {

        const response =
            jarvisResponse(text);

        addMessage(response, "jarvis");

    }, 400);
}


function quickMessage(text) {

    document.getElementById("userInput")
        .value = text;

    sendMessage();
}


function handleEnter(event) {

    if (event.key === "Enter") {

        sendMessage();

    }
}


function addMessage(text, type) {

    const messages =
        document.getElementById("messages");

    const message =
        document.createElement("div");

    message.className =
        "message " + type;

    message.innerHTML =
        text;

    messages.appendChild(message);

    messages.scrollTop =
        messages.scrollHeight;
}


// ============================
// JARVIS BRAIN
// ============================

function jarvisResponse(input) {

    const text =
        input.toLowerCase();


    // CALENDAR

    if (
        text.includes("schedule") ||
        text.includes("calendar") ||
        text.includes("events")
    ) {

        if (events.length === 0) {

            return "You don't have any events scheduled yet.";

        }

        return `
            You currently have
            <strong>${events.length}</strong>
            scheduled event(s).
        `;
    }


    // FINANCES

    if (
        text.includes("money") ||
        text.includes("spent") ||
        text.includes("expense") ||
        text.includes("budget")
    ) {

        const total =
            expenses.reduce(

                (sum, expense) =>
                    sum + expense.amount,

                0
            );

        return `
            You've spent
            <strong>$${total.toFixed(2)}</strong>
            so far.
        `;
    }


    // TASKS

    if (
        text.includes("task") ||
        text.includes("todo") ||
        text.includes("to do")
    ) {

        if (tasks.length === 0) {

            return "You don't have any outstanding tasks.";

        }

        return `
            You have
            <strong>${tasks.length}</strong>
            outstanding task(s).
        `;
    }


    // GREETING

    if (
        text.includes("hello") ||
        text.includes("hi") ||
        text.includes("hey")
    ) {

        return "Hello. I'm Jarvis. What would you like me to do?";

    }


    // DEFAULT

    return `
        I'm currently running in
        <strong>Jarvis Basic Mode</strong>.
        <br><br>
        My AI brain will be connected in the next version.
    `;
}


// ============================
// STARTUP
// ============================

displayEvents();

displayTasks();

displayMoney();
