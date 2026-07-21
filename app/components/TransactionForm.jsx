export default function TransactionForm({
  editingId,
  formData,
  handleChange,
  handleSubmit,
  loading,
  setEditingId,
  setFormData,
  today,
}) {
  return (
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
  );
}