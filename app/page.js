"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const today = new Date().toISOString().split("T")[0];

  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "Food",
    date: today,
  });

  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSubmit(event) {
  if (event) {
    event.preventDefault();
  }

  alert("Button clicked");

  if (!formData.title || !formData.amount || !formData.date) {
    alert("Please fill in all fields.");
    return;
  }

    const newTransaction = {
      id: Date.now(),
      title: formData.title,
      amount: Number(formData.amount),
      type: formData.type,
      category: formData.category,
      date: formData.date,
    };

    setTransactions([newTransaction, ...transactions]);

    setFormData({
    title: "",
    amount: "",
    type: "expense",
    category: "Food",
    date: today,
    });
  }

  function deleteTransaction(id) {
    const updatedTransactions = transactions.filter(
      (transaction) => transaction.id !== id
    );

    setTransactions(updatedTransactions);
  }

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = totalIncome - totalExpense;

  const topCategory = getTopCategory(transactions);

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="tag">Personal Finance Tracker</p>
          <h1>WhyAmIBroke?</h1>
          <p className="heroText">
            Track your income and spending before your wallet starts crying.
          </p>
        </div>

        <div className="heroCard">
          <p>This Month</p>
          <h2>RM {balance.toFixed(2)}</h2>
          <span>Current balance</span>
        </div>
      </section>

      <section className="statsGrid">
        <div className="statCard">
          <p>Total Income</p>
          <h2>RM {totalIncome.toFixed(2)}</h2>
        </div>

        <div className="statCard">
          <p>Total Spent</p>
          <h2>RM {totalExpense.toFixed(2)}</h2>
        </div>

        <div className="statCard">
          <p>Top Spending</p>
          <h2>{topCategory}</h2>
        </div>
      </section>

      <section className="contentGrid">
        <div className="formCard">
          <h2>Add Transaction</h2>

          <div className="transactionForm">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="Example: McDonald's"
              value={formData.title}
              onChange={handleChange}
            />

            <label>Amount</label>
            <input
              type="number"
              name="amount"
              placeholder="Example: 18.50"
              value={formData.amount}
              onChange={handleChange}
            />

            <label>Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Salary">Salary</option>
              <option value="Allowance">Allowance</option>
              <option value="Other">Other</option>
            </select>

            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />

            <button type="button" className="submitBtn" onClick={handleSubmit}>
              Add Transaction
            </button>
          </div>
        </div>

        <div className="historyCard">
          <h2>Transaction History</h2>

          {transactions.length === 0 ? (
            <p className="emptyText">
              No transactions yet. Add one to find out why you are broke.
            </p>
          ) : (
            <div className="transactionList">
              {transactions.map((transaction) => (
                <div className="transactionItem" key={transaction.id}>
                  <div>
                    <h3>{transaction.title}</h3>
                    <p>
                      {transaction.category} • {transaction.date}
                    </p>
                  </div>

                  <div className="transactionRight">
                    <strong
                      className={
                        transaction.type === "income" ? "income" : "expense"
                      }
                    >
                      {transaction.type === "income" ? "+" : "-"} RM{" "}
                      {transaction.amount.toFixed(2)}
                    </strong>

                    <button
                      className="deleteBtn"
                      onClick={() => deleteTransaction(transaction.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function getTopCategory(transactions) {
  const expenses = transactions.filter(
    (transaction) => transaction.type === "expense"
  );

  if (expenses.length === 0) {
    return "None";
  }

  const categoryTotals = {};

  expenses.forEach((transaction) => {
    if (!categoryTotals[transaction.category]) {
      categoryTotals[transaction.category] = 0;
    }

    categoryTotals[transaction.category] += transaction.amount;
  });

  let topCategory = "";
  let highestAmount = 0;

  Object.keys(categoryTotals).forEach((category) => {
    if (categoryTotals[category] > highestAmount) {
      highestAmount = categoryTotals[category];
      topCategory = category;
    }
  });

  return topCategory;
}