const express = require('express')
const router = express.Router()
const {expenses, saveExpenses} = require('../data')

router.get('/', (req, res, next) => {
    next()
})

router.get('/expenses', (req, res) => {
    let filterExpenses = expenses
    if(req.query.type){
        filterExpenses = filterExpenses.filter(
            expense => expense.type === req.query.type
        )
    }
    if(req.query.category){
        filterExpenses = filterExpenses.filter(
            expense => expense.category === req.query.category
        )
    }
    if(req.query.startDate){
        filterExpenses = filterExpenses.filter(
            expense => expense.date >= req.query.startDate
        )
    }
    if(req.query.endDate){
        filterExpenses = filterExpenses.filter(
            expense => expense.date <= req.query.endDate
        )
    }
    res.json(filterExpenses)
})

router.get('/expenses/summary', (req, res) => {
    const totalIncome = expenses
        .filter(expense => expense.type === 'income')
        .reduce((total, expense) => total + expense.amount, 0)
    const totalExpenses = expenses
        .filter(expense => expense.type === 'expense')
        .reduce((total, expense) => total + expense.amount, 0)
    const balance = totalIncome - totalExpenses
    res.json({totalIncome, totalExpenses, balance})
})

router.get('/expenses/:id', (req, res) => {
    const id = Number(req.params.id)
    const expense = expenses.find(expense => expense.id === id)
    if(!expense){
        return res.status(404).json({message: 'Expense Not found'})
    }
    res.json(expense)
})

router.patch('/expenses/:id', (req, res) => {
    const id = Number(req.params.id)
    const expense = expenses.find(expense => expense.id === id)
    if(!expense){
        return res.status(404).json({message: 'Expense Not found'})
    }

    if(!req.body || Object.keys(req.body).length === 0){
        return res.status(400).json({message: 'Request body must not be empty'})
    }

    const allowedFields = ['title', 'amount', 'category', 'type', 'date']
    const unExpectedField = Object.keys(req.body).filter(
        feild => !allowedFields.includes(feild)
    )
    if(unExpectedField.length > 0){
        return res.status(400).json({
            message: 'unexpected fields', 
            feilds: unExpectedField
        })
    }

    const {title, amount, category, type, date} = req.body
    if(title !== undefined){
        if(typeof title !== 'string' || title.trim() === ''){
            return res.status(400).json({message: "title must not be empty string"})
        }
    }
    if(amount !== undefined){
        if(typeof amount !== 'number' || amount <= 0){
            return res.status(400).json({message: "amount must be positive number"})
        }
    }
    if (category !== undefined) {
        if (typeof category !== 'string' || category.trim() === '') {
            return res.status(400).json({message: 'Category must be a non-empty string'})
        }
    }
    if (type !== undefined) {
        if (type !== 'income' && type !== 'expense') {
            return res.status(400).json({message: 'Type must be income or expense'})
        }
    }
    if (date !== undefined) {
        if (typeof date !== 'string' || date.trim() === "") {
            return res.status(400).json({message: 'Date must be not empty'})
        }
    }
    if(title !== undefined) expense.title = title
    if(amount !== undefined) expense.amount = amount
    if(category !== undefined) expense.category = category
    if(type !== undefined) expense.type = type
    if(date !== undefined) expense.date = date
    saveExpenses()
    res.json(expense)
})

router.post('/expenses', (req, res) => {
    const allowedFields = ['title', 'amount', 'category', 'type', 'date']
    const unExpectedField = Object.keys(req.body).filter(
        feild => !allowedFields.includes(feild)
    )
    if(unExpectedField.length > 0){
        return res.status(400).json({
            message: 'unexpected fields', 
            feilds: unExpectedField
        })
    }
    if(
        !req.body ||
        req.body.title === undefined ||
        req.body.amount === undefined ||
        req.body.category === undefined ||
        req.body.type === undefined
    ){
        return res.status(400).json({message: 'All fields required'})
    }
    if(typeof req.body.amount !== 'number' || req.body.amount <= 0){
        return res.status(400).json({message: 'amount must be positive number'})
    }
    if(req.body.type !== 'expense' && req.body.type !== 'income'){
        return res.status(400).json({message: 'Type must be income or expense'})
    }
    if(
        typeof req.body.title !== 'string' ||
        req.body.title.trim() === '' ||
        typeof req.body.category !== 'string' ||
        req.body.category.trim() === ''
    ){
        return res.status(400).json({message: "Title and Category must be non-empty string"})
    }

    const newExpense = {
        id: Math.max(0, ...expenses.map(expense => expense.id))+1,
        title: req.body.title,
        amount: req.body.amount,
        category: req.body.category,
        type: req.body.type,
        date: req.body.date
    }
    expenses.push(newExpense)
    saveExpenses()
    res.status(201).json(newExpense)
})

router.delete('/expenses/:id', (req, res) => {
    const id = Number(req.params.id)
    const expenseIndex = expenses.findIndex(expense => expense.id === id)
    if(expenseIndex === -1){
        return res.status(404).json({message: 'Expense Not found'})
    }
    expenses.splice(expenseIndex, 1)
    saveExpenses()

    res.json({message: 'Expense deleted successfully'})
})

module.exports = router