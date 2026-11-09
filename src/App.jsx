
import { useEffect, useState } from "react";
import "./App.css";

const categories = [
  "Food",
  "Transportation",
  "Shopping",
  "Bills",
  "Entertainment",
  "Other",
];

function App() {
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("expenses") || "[]"
      );
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  function addExpense(event) {
    event.preventDefault();

    const numericAmount = Number(amount);

    if (
      !description.trim() ||
      !amount.trim() ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0 ||
      !date
    ) {
      setError(
        "Enter a description, positive amount, and valid date."
      );
      setMessage("");
      return;
    }

    const expense = {
      id: crypto.randomUUID(),
      description: description.trim(),
      amount: Number(numericAmount.toFixed(2)),
      category,
      date,
    };

    setExpenses((previous) => [expense, ...previous]);

    setDescription("");
    setAmount("");
    setCategory("Food");
    setError("");
    setMessage("Expense added successfully.");
  }

  function deleteExpense(id) {
    setExpenses((previous) =>
      previous.filter((expense) => expense.id !== id)
    );
    setMessage("Expense deleted successfully.");
    setError("");
  }

  function formatMoney(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  }

  return (
    <main className="container">
      <header className="header">
        <h1>Personal Expense Tracker</h1>
        <p>Manage your expenses and monitor your spending.</p>
      </header>

      <section className="summary" aria-label="Spending summary">
        <h2>Total Spending</h2>
        <p className="total">{formatMoney(total)}</p>
        <p>{expenses.length} recorded expenses</p>
      </section>

      <section className="card">
        <h2>Add New Expense</h2>

        <form onSubmit={addExpense}>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              type="text"
              placeholder="Example: Groceries"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount ($)</label>
            <input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="add-button">
            Add Expense
          </button>
        </form>

        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}

        {message && (
          <p role="status" className="success">
            {message}
          </p>
        )}
      </section>

      <section className="card">
        <h2>Expense History</h2>

        {expenses.length === 0 ? (
          <p className="empty">
            No expenses recorded yet. Add your first expense above.
          </p>
        ) : (
          <div className="expense-list">
            {expenses.map((expense) => (
              <article className="expense" key={expense.id}>
                <div>
                  <h3>{expense.description}</h3>
                  <p>
                    {expense.category} | {expense.date}
                  </p>
                </div>

                <div className="expense-actions">
                  <strong>{formatMoney(expense.amount)}</strong>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => deleteExpense(expense.id)}
                    aria-label={`Delete ${expense.description}`}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;