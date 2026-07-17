"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const today = new Date().toISOString().split("T")[0];

  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
  });

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "Food",
    date: today,
  });

  useEffect(() => {
    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);

        if (session?.user) {
          fetchTransactions(session.user.id);
        } else {
          setTransactions([]);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    const { data } = await supabase.auth.getUser();

    if (data?.user) {
      setUser(data.user);
      fetchTransactions(data.user.id);
    }
  }

  function handleAuthChange(event) {
    const { name, value } = event.target;

    setAuthData({
      ...authData,
      [name]: value,
    });
  }

  async function handleRegister() {
    if (!authData.email || !authData.password) {
      alert("Please enter email and password.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: authData.email.trim(),
      password: authData.password.trim(),
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created. You can now login.");
  }

  async function handleLogin() {
    if (!authData.email || !authData.password) {
      alert("Please enter email and password.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: authData.email.trim(),
      password: authData.password.trim(),
    });

    if (error) {
      alert(error.message);
      return;
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setTransactions([]);
  }

  async function fetchTransactions(userId) {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
      alert("Failed to load transactions.");
      return;
    }

    setTransactions(data || []);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }

    if (!user) {
      alert("Please login first.");
      return;
    }

    if (!formData.title || !formData.amount || !formData.date) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    let error;

    if (editingId) {
      const result = await supabase
        .from("transactions")
        .update({
          title: formData.title,
          amount: Math.abs(Number(formData.amount)),
          type: formData.type.toLowerCase(),
          category: formData.category,
          transaction_date: formData.date,
        })
        .eq("id", editingId)
        .eq("user_id", user.id);

      error = result.error;
    } else {
      const result = await supabase.from("transactions").insert([
        {
          title: formData.title,
          amount: Math.abs(Number(formData.amount)),
          type: formData.type.toLowerCase(),
          category: formData.category,
          transaction_date: formData.date,
          user_id: user.id,
        },
      ]);

      error = result.error;
    }

    setLoading(false);

    if (error) {
      console.error("Save error:", error);
      alert("Failed to save transaction.");
      return;
    }

    setFormData({
      title: "",
      amount: "",
      type: "expense",
      category: "Food",
      date: today,
    });

    setEditingId(null);
    fetchTransactions(user.id);
  }

  function startEdit(transaction) {
    setEditingId(transaction.id);

    setFormData({
      title: transaction.title,
      amount: Math.abs(Number(transaction.amount)),
      type: transaction.type,
      category: transaction.category,
      date: transaction.transaction_date,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteTransaction(id) {
    if (!user) {
      alert("Please login first.");
      return;
    }

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Delete error:", error);
      alert("Failed to delete transaction.");
      return;
    }

    fetchTransactions(user.id);
  }

  const totalIncome = transactions
    .filter((transaction) => transaction.type?.toLowerCase() === "income")
    .reduce((total, transaction) => total + Math.abs(Number(transaction.amount)), 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type?.toLowerCase() === "expense")
    .reduce((total, transaction) => total + Math.abs(Number(transaction.amount)), 0);

  const balance = totalIncome - totalExpense;

  const topCategory = getTopCategory(transactions);

  if (!user) {
    return (
      <main className="page">
        <section className="authWrapper">
          <div className="authCard">
            <p className="tag">Personal Finance Tracker</p>
            <h1>WhyAmIBroke?</h1>
            <p className="heroText">
              Login to track where your money disappeared.
            </p>

            <div className="authTabs">
              <button
                className={authMode === "login" ? "activeTab" : ""}
                onClick={() => setAuthMode("login")}
              >
                Login
              </button>

              <button
                className={authMode === "register" ? "activeTab" : ""}
                onClick={() => setAuthMode("register")}
              >
                Register
              </button>
            </div>

            <div className="transactionForm">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={authData.email}
                onChange={handleAuthChange}
              />

              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Minimum 6 characters"
                value={authData.password}
                onChange={handleAuthChange}
              />

              {authMode === "login" ? (
                <button type="button" className="submitBtn" onClick={handleLogin}>
                  Login
                </button>
              ) : (
                <button
                  type="button"
                  className="submitBtn"
                  onClick={handleRegister}
                >
                  Register
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="topBar">
        <p>Logged in as: {user.email}</p>
        <button className="logoutBtn" onClick={handleLogout}>
          Logout
        </button>
      </section>

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
          <h2>{editingId ? "Edit Transaction" : "Add Transaction"}</h2>

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

            <button
              type="button"
              className="submitBtn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? editingId
                  ? "Updating..."
                  : "Adding..."
                : editingId
                ? "Update Transaction"
                : "Add Transaction"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancelBtn"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    title: "",
                    amount: "",
                    type: "expense",
                    category: "Food",
                    date: today,
                  });
                }}
              >
                Cancel Edit
              </button>
            )}
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
                      {transaction.category} • {transaction.transaction_date}
                    </p>
                  </div>

                  <div className="transactionRight">
                    <strong
                      className={
                        transaction.type === "income" ? "income" : "expense"
                      }
                    >
                      {transaction.type === "income" ? "+" : "-"} RM{" "}
                      {Math.abs(Number(transaction.amount)).toFixed(2)}
                    </strong>

                    <button
                      className="editBtn"
                      onClick={() => startEdit(transaction)}
                    >
                      Edit
                    </button>

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
    (transaction) => transaction.type?.toLowerCase() === "expense"
  );

  if (expenses.length === 0) {
    return "None";
  }

  const categoryTotals = {};

  expenses.forEach((transaction) => {
    if (!categoryTotals[transaction.category]) {
      categoryTotals[transaction.category] = 0;
    }

    categoryTotals[transaction.category] += Math.abs(Number(transaction.amount));
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