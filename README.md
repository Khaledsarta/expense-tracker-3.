# Expense Tracker

A simple Expense Tracker application built using Node.js, Express.js, and Vanilla JavaScript.

The application allows users to manage their income and expenses through a simple interface.

## Features

- Add new income and expenses.
- View all transactions.
- Edit existing transactions.
- Delete transactions.
- Filter transactions by type and category.
- Filter transactions by date range.
- Sort transactions by date and amount.
- View financial summary:
  - Total Income
  - Total Expenses
  - Balance
- Input validation and error handling.

## Technologies Used

**Backend:**

- Node.js
- Express.js
- File System (JSON storage)

**Frontend:**

- HTML
- CSS
- Vanilla JavaScript
- Fetch API

## Project Structure

```text
Expense-Tracker/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── routes/
│   └── expenses.js
│
├── data.js
├── expenses.json
├── server.js
├── package.json
├── package-lock.json
└── .gitignore
```

## API Endpoints

| Method | Endpoint          | Description           |
| ------ | ----------------- | --------------------- |
| GET    | /expenses         | Get all expenses      |
| GET    | /expenses/summary | Get financial summary |
| GET    | /expenses/:id     | Get expense by ID     |
| POST   | /expenses         | Add a new expense     |
| PATCH  | /expenses/:id     | Update an expense     |
| DELETE | /expenses/:id     | Delete an expense     |

### Filtering

The GET `/expenses` endpoint supports:

- `type`: Filter by income or expense.
- `category`: Filter by category.
- `startDate`: Filter from a specific date.
- `endDate`: Filter until a specific date.

Example:

```text
/expenses?type=expense&category=Food
```

## Installation

1. Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
```

2. Navigate to the project directory:

```bash
cd Expense-Tracker
```

3. Install dependencies:

```bash
npm install
```

4. Start the server:

```bash
node server.js
```

5. Open your browser:

```text
http://localhost:5000
```

## Data Storage

The application uses a local JSON file (`expenses.json`) to store transactions. No external database is required.

## Future Improvements

- Integrate MongoDB.
- Add user authentication.
- Improve API error handling.
