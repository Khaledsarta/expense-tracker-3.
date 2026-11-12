const express = require('express')
const app = express()
app.use(express.json())

const expensesRouter = require('./routes/expenses')
app.use('/', expensesRouter)
app.use(express.static('public'))

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.status ? err.message : 'Internal Server Error'
    })
})

app.listen(5000, () => {
    console.log('server running on port 5000')
})