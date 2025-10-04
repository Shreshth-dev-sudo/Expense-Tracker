// const express = require('express');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// const PORT = 3000;
// const DB_FILE = path.join(__dirname, 'db.json');

// // Middleware
// // Use body-parser to parse incoming JSON payloads
// app.use(bodyParser.json());

// // Serve static files (your frontend: index.html, style.css, script.js)
// app.use(express.static(path.join(__dirname, ''))); 

// // Helper function to read expenses from db.json
// function readExpenses() {
//     try {
//         const data = fs.readFileSync(DB_FILE, 'utf8');
//         // Ensure we return a valid array, even if the file is empty/corrupted
//         return JSON.parse(data || '[]'); 
//     } catch (error) {
//         console.error("Error reading db.json:", error.message);
//         return []; // Return empty array if file doesn't exist or is corrupted
//     }
// }

// // Helper function to write expenses to db.json
// function writeExpenses(expenses) {
//     fs.writeFileSync(DB_FILE, JSON.stringify(expenses, null, 2), 'utf8');
// }

// // --- API Endpoints ---

// // 1. GET /api/expenses: Fetch all expenses
// app.get('/api/expenses', (req, res) => {
//     const expenses = readExpenses();
//     res.json(expenses);
// });

// // 2. POST /api/expenses: Add a new expense
// app.post('/api/expenses', (req, res) => {
//     const newExpense = req.body;
//     const expenses = readExpenses();
    
//     // Add a unique ID to the new expense
//     newExpense.id = Date.now(); 
    
//     expenses.push(newExpense);
//     writeExpenses(expenses);
    
//     res.status(201).json(newExpense); // Return the newly created item
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Backend server running on http://localhost:${PORT}`);
//     console.log(`Access the application at http://localhost:${PORT}/index.html`);
// });

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json');

// Middleware
app.use(bodyParser.json());

// Serve static files (your frontend: index.html, style.css, script.js)
app.use(express.static(path.join(__dirname, ''))); 

// Helper function to read expenses from db.json
function readExpenses() {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        // Ensure we return a valid array, even if the file is empty/corrupted
        return JSON.parse(data || '[]'); 
    } catch (error) {
        console.error("Error reading db.json:", error.message);
        return []; // Return empty array if file doesn't exist or is corrupted
    }
}

// Helper function to write expenses to db.json
function writeExpenses(expenses) {
    fs.writeFileSync(DB_FILE, JSON.stringify(expenses, null, 2), 'utf8');
}

// --- API Endpoints ---

// 1. GET /api/expenses: Fetch all expenses
app.get('/api/expenses', (req, res) => {
    const expenses = readExpenses();
    res.json(expenses);
});

// 2. POST /api/expenses: Add a new expense
app.post('/api/expenses', (req, res) => {
    const newExpense = req.body;
    const expenses = readExpenses();
    
    // Add a unique ID (required for deletion)
    newExpense.id = Date.now(); 
    
    expenses.push(newExpense);
    writeExpenses(expenses);
    
    res.status(201).json(newExpense); 
});

// 3. DELETE /api/expenses/:id: Remove an expense (NEW CODE)
app.delete('/api/expenses/:id', (req, res) => {
    // ID comes from the URL (e.g., /api/expenses/12345), convert to number
    const idToDelete = parseInt(req.params.id); 
    let expenses = readExpenses();
    
    // Filter the array: keeps all items whose ID does NOT match the ID to delete
    const initialLength = expenses.length;
    expenses = expenses.filter(expense => expense.id !== idToDelete);
    
    // Check if an item was actually removed before writing
    if (expenses.length < initialLength) {
        writeExpenses(expenses);
        // 204 No Content is the standard response for successful deletion
        res.status(204).send(); 
    } else {
        res.status(404).json({ error: 'Expense not found' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`Access the application at http://localhost:${PORT}/index.html`);
});