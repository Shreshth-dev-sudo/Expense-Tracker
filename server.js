const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Define file paths
const DB_FILE = path.join(__dirname, 'db.json');
const BUDGET_FILE = path.join(__dirname, 'budget.json');

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, ''))); 

// ========== HELPER FUNCTIONS ==========

// ✅ Read expenses safely
function readExpenses() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf8');
            return [];
        }
        const data = fs.readFileSync(DB_FILE, 'utf8').trim();
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Error reading db.json:", error.message);
        return [];
    }
}

// ✅ Write expenses safely
function writeExpenses(expenses) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(expenses, null, 2), 'utf8');
    } catch (error) {
        console.error("Error writing db.json:", error.message);
        throw error;
    }
}

// ✅ Read budget safely (handles missing or empty file)
function readBudget() {
    try {
        if (!fs.existsSync(BUDGET_FILE)) {
            fs.writeFileSync(BUDGET_FILE, JSON.stringify({ limit: 0 }, null, 2), 'utf8');
            return 0;
        }

        const data = fs.readFileSync(BUDGET_FILE, 'utf8').trim();
        if (!data) {
            fs.writeFileSync(BUDGET_FILE, JSON.stringify({ limit: 0 }, null, 2), 'utf8');
            return 0;
        }

        const budget = JSON.parse(data);
        return parseFloat(budget.limit) || 0;

    } catch (error) {
        console.error("Error reading budget.json:", error.message);
        return 0;
    }
}

// ✅ Write budget safely
function writeBudget(limit) {
    try {
        fs.writeFileSync(BUDGET_FILE, JSON.stringify({ limit: limit }, null, 2), 'utf8');
    } catch (error) {
        console.error("Error writing budget.json:", error.message);
        throw error;
    }
}

// ========== API ROUTES ==========

// GET all expenses
app.get('/api/expenses', (req, res) => {
    try {
        res.json(readExpenses());
    } catch (error) {
        console.error("GET /api/expenses failed:", error.message);
        res.status(500).json({ error: 'Failed to fetch expenses.' });
    }
});

// POST new expense
app.post('/api/expenses', (req, res) => {
    try {
        const newExpense = req.body;
        const expenses = readExpenses();
        newExpense.id = Date.now();
        expenses.push(newExpense);
        writeExpenses(expenses);
        res.status(201).json(newExpense);
    } catch (error) {
        console.error("POST /api/expenses failed:", error.message);
        res.status(500).json({ error: 'Failed to add expense.' });
    }
});

// DELETE expense by ID
app.delete('/api/expenses/:id', (req, res) => {
    try {
        const idToDelete = parseInt(req.params.id);
        let expenses = readExpenses();
        const initialLength = expenses.length;
        expenses = expenses.filter(expense => expense.id !== idToDelete);

        if (expenses.length < initialLength) {
            writeExpenses(expenses);
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Expense not found.' });
        }
    } catch (error) {
        console.error("DELETE /api/expenses failed:", error.message);
        res.status(500).json({ error: 'Failed to delete expense.' });
    }
});

// GET current budget
app.get('/api/budget', (req, res) => {
    try {
        const budgetLimit = readBudget();
        res.json({ limit: budgetLimit });
    } catch (error) {
        console.error("GET /api/budget failed:", error.message);
        res.status(500).json({ error: 'Failed to fetch budget limit.' });
    }
});

// POST new budget limit
app.post('/api/budget', (req, res) => {
    try {
        const { limit } = req.body;
        const limitAmount = parseFloat(limit);

        if (isNaN(limitAmount) || limitAmount < 0) {
            return res.status(400).json({ error: 'Invalid budget limit.' });
        }

        writeBudget(limitAmount);
        res.status(200).json({ message: 'Budget limit saved successfully', limit: limitAmount });
 } catch (error) {
        console.error("Error saving budget:", error.message);
        res.status(500).json({ message: 'Failed to save budget limit.' });
    }
});

// ========== START SERVER ==========
app.listen(PORT, () => {
    console.log(`✅ Backend server running on http://localhost:${PORT}`);
    console.log(`💻 Access the app via http://localhost:${PORT}/index.html`);
});
