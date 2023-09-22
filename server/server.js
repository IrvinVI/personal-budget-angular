//Budget API
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const budgetData = require('./budget-data.json');

app.use(cors());

const budget = {
    myBudget: [
    {
        title: 'Eat out',
        budget: 25
    },
    {
        title: 'Rent',
        budget: 375
    },
    {
        title: 'Groceries',
        budget: 110
    },
]
};


app.get('/budget', (req,res) => {
    res.json(budgetData);
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`)
});