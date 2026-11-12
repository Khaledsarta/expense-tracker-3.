const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, 'expenses.json')
let expenses = JSON.parse(fs.readFileSync(filePath, 'utf8'))

function saveExpenses(){
    fs.writeFileSync(filePath, JSON.stringify(expenses, null, 2))
}

module.exports = {
    expenses,
    saveExpenses
}