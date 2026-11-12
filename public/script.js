function loadSummary(){
    fetch('/expenses/summary')
    .then(response => response.json())
    .then(data => {
        document.getElementById('total-income').textContent = data.totalIncome
        document.getElementById('total-expenses').textContent = data.totalExpenses
        document.getElementById('balance').textContent = data.balance
    })
    .catch(error => {
        console.log('Error fetching Summary: ', error)
    })
}
loadSummary()

function loadExpenses(){
    const typeFilter = document.getElementById("type-filter").value
    const categoryFilter = document.getElementById("category-filter").value
    const startDate = document.getElementById("start-date").value
    const endDate = document.getElementById("end-date").value
    const params = new URLSearchParams()

    if(typeFilter !== 'all'){
        params.append('type', typeFilter)
    }
    if(categoryFilter !== 'all'){
        params.append('category', categoryFilter)
    }
    if(startDate){
        params.append('startDate', startDate)
    }
    if(endDate){
        params.append('endDate', endDate)
    }
    const url = params.toString() ? `/expenses?${params.toString()}` : '/expenses'
    fetch(url)
    .then(response => response.json())
    .then(data => {
        const sortFilter = document.getElementById("sort-filter").value
        if(sortFilter === 'newist'){
            data.sort((a, b) => new Date(b.date) - new Date(a.date))
        }
        else if(sortFilter === 'oldest'){
            data.sort((a, b) => new Date(a.date) - new Date(b.date))
        }
        else if(sortFilter === 'highest'){
            data.sort((a, b) => b.amount - a.amount)
        }
        else if(sortFilter === 'lowest'){
            data.sort((a, b) => a.amount - b.amount)
        }
        const expensesList = document.getElementById('expenses-list')
        expensesList.innerHTML = ``
        data.forEach(expense => {
    const row = document.createElement('tr')
    row.innerHTML = `
        <td>${expense.id}</td>
        <td>${expense.title}</td>
        <td>${expense.amount}</td>
        <td>${expense.category}</td>
        <td>${expense.type}</td>
        <td>
            <button class="edit-btn" onClick = 'editExpense(${expense.id})'>Edit</button>
        </td>
        <td>
            <button class="delete-btn" onclick="deleteExpenses(${expense.id})">Delete</button>
        </td>
    `
    expensesList.appendChild(row)
});
    })
    .catch(error => {
        console.log('error fetching expenses: ', error)
    })
}
loadExpenses()

let editingExpenseId = null

const expenseForm = document.getElementById('expense-form')
expenseForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const newExpense = {
        title: document.getElementById('title').value,
        amount: Number(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        type: document.getElementById('type').value,
        date: document.getElementById('date').value
    }

    fetch('/expenses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newExpense)
    }).then(response => response.json())
    .then(data => {
        console.log(data)
        expenseForm.reset()
        loadExpenses()
        loadSummary()
    })
    .catch(error => {
        console.log('Error adding expense: ', error)
    })
})

function deleteExpenses(id){
    fetch(`/expenses/${id}`, {
        method: 'DELETE'
    }).then(response => response.json()).then(data => {
        console.log(data)
        loadExpenses()
        loadSummary()
    }).catch(error => {
        console.log("error deleting expenses: ", error)
    })
}

function editExpense(id) {
    fetch(`/expenses/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch expense')
            }
            return response.json()
        })
        .then(expense => {
            editingExpenseId = id
            document.getElementById('edit-title').value = expense.title
            document.getElementById('edit-amount').value = expense.amount
            document.getElementById('edit-category').value = expense.category
            document.getElementById('edit-type').value = expense.type
            document.getElementById('edit-date').value = expense.date

            document.getElementById('edit-modal').style.display = 'flex'
        })
        .catch(error => {
            console.log('Error fetching expense:', error)
        })
}

function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none'
}

const editForm = document.getElementById('edit-form')

editForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const updatedExpense = {
        title: document.getElementById('edit-title').value,
        amount: Number(document.getElementById('edit-amount').value),
        category: document.getElementById('edit-category').value,
        type: document.getElementById('edit-type').value,
        date: document.getElementById('edit-date').value
    }

    fetch(`/expenses/${editingExpenseId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedExpense)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update expense')
            }
            return response.json()
        })
        .then(data => {
            console.log(data)
            closeEditModal()
            loadExpenses()
            loadSummary()
        })
        .catch(error => {
            console.log('Error updating expense:', error)
        })
})

document.getElementById('type-filter').addEventListener('change', () => {
    loadExpenses()
})
document.getElementById('category-filter').addEventListener('change', () => {
    loadExpenses()
})
document.getElementById('start-date').addEventListener('change', () => {
    loadExpenses()
})
document.getElementById('end-date').addEventListener('change', () => {
    loadExpenses()
})
document.getElementById('sort-filter').addEventListener('change', () => {
    loadExpenses()
})

function loadCategories(){
    fetch('/expenses')
        .then(response => response.json())
        .then(data => {
            const categoryFilter = document.getElementById('category-filter')
            console.log('category-filter', categoryFilter)
            const categories = [...new Set(data.map(expense => expense.category))]
            categories.forEach(category => {
                const option = document.createElement('option')
                option.value = category
                option.textContent = category
                categoryFilter.appendChild(option)
            })
        })
        .catch(error => {
            console.log('Error loading categories: ', error)
        })
}
loadCategories()