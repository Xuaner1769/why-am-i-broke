"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Navbar from "./components/Navbar";
import TransactionHistory from "./components/TransactionHistory";
import TransactionForm from "./components/TransactionForm";
import DashboardCards from "./components/DashboardCards";
import CategoryChart from "./components/CategoryChart";
import LoginPage from "./components/LoginPage";
import HeroCard from "./components/HeroCard";
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

  const [selectedMonth, setSelectedMonth] = useState("");

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
      .order("transaction_date", { ascending: false })
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

  const filteredTransactions = selectedMonth
    ? transactions.filter((transaction) => {
        return transaction.transaction_date?.slice(0, 7) === selectedMonth;
      })
    : transactions;

  const overallIncome = transactions
    .filter((transaction) => transaction.type?.toLowerCase() === "income")
    .reduce((total, transaction) => total + Math.abs(Number(transaction.amount)), 0);

  const overallExpense = transactions
    .filter((transaction) => transaction.type?.toLowerCase() === "expense")
    .reduce((total, transaction) => total + Math.abs(Number(transaction.amount)), 0);

  const overallBalance = overallIncome - overallExpense;

  const historyIncome = filteredTransactions
    .filter((transaction) => transaction.type?.toLowerCase() === "income")
    .reduce((total, transaction) => total + Math.abs(Number(transaction.amount)), 0);

  const historyExpense = filteredTransactions
    .filter((transaction) => transaction.type?.toLowerCase() === "expense")
    .reduce((total, transaction) => total + Math.abs(Number(transaction.amount)), 0);

  const historyBalance = historyIncome - historyExpense;

  const categoryChartData = getCategoryChartData(filteredTransactions);
  const topCategory = categoryChartData.length > 0 ? categoryChartData[0].category : "None";

 if (!user) {
  return (
    <main className="page">
      <LoginPage
        authMode={authMode}
        setAuthMode={setAuthMode}
        authData={authData}
        handleAuthChange={handleAuthChange}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
      />
    </main>
  );
}
  return (
  <main className="page">
    <Navbar
      user={user}
      onLogout={handleLogout}
    />

    <section className="hero">
      <div>
        <p className="tag">Personal Finance Tracker</p>

        <h1>WhyAmIBroke?</h1>

        <p className="heroText">
          Track your income and spending before your wallet starts crying.
        </p>
      </div>

      <HeroCard overallBalance={overallBalance} />
    </section>

    <DashboardCards
      selectedMonth={selectedMonth}
      formatMonth={formatMonth}
      historyIncome={historyIncome}
      historyExpense={historyExpense}
      historyBalance={historyBalance}
      topCategory={topCategory}
    />

    <CategoryChart
      selectedMonth={selectedMonth}
      formatMonth={formatMonth}
      categoryChartData={categoryChartData}
    />

    <section className="contentGrid">
      <TransactionForm
        editingId={editingId}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        loading={loading}
        setEditingId={setEditingId}
        setFormData={setFormData}
        today={today}
      />

      <TransactionHistory
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        filteredTransactions={filteredTransactions}
        formatMonth={formatMonth}
        startEdit={startEdit}
        deleteTransaction={deleteTransaction}
      />
    </section>
  </main>
);
}
  

function formatMonth(monthValue) {
  if (!monthValue) {
    return "";
  }

  const [year, month] = monthValue.split("-");
  const date = new Date(Number(year), Number(month) - 1);

  return date.toLocaleDateString("en-MY", {
    month: "long",
    year: "numeric",
  });
}

function getCategoryChartData(transactions) {
  const expenses = transactions.filter(
    (transaction) => transaction.type?.toLowerCase() === "expense"
  );

  const categoryTotals = {};

  expenses.forEach((transaction) => {
    if (!categoryTotals[transaction.category]) {
      categoryTotals[transaction.category] = 0;
    }

    categoryTotals[transaction.category] += Math.abs(Number(transaction.amount));
  });

  const totalExpense = Object.values(categoryTotals).reduce(
    (total, amount) => total + amount,
    0
  );

  if (totalExpense === 0) {
    return [];
  }

  return Object.keys(categoryTotals)
    .map((category) => {
      const amount = categoryTotals[category];

      return {
        category,
        amount,
        percentage: (amount / totalExpense) * 100,
      };
    })
    .sort((a, b) => b.amount - a.amount);
}