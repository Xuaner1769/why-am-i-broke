export default function TransactionHistory({
  selectedMonth,
  setSelectedMonth,
  filteredTransactions,
  formatMonth,
  startEdit,
  deleteTransaction,
}) {
  return (
    <div className="historyCard">
      <div className="historyHeader">
        <div>
          <h2>Transaction History</h2>

          <p className="historySubtitle">
            {selectedMonth
              ? `Showing ${formatMonth(selectedMonth)} records`
              : "Showing all transaction records"}
          </p>
        </div>

        <div className="historyFilter">
          <input
            type="month"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
          />

          {selectedMonth && (
            <button
              type="button"
              className="clearFilterBtn"
              onClick={() => setSelectedMonth("")}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <p className="emptyText">
          {selectedMonth
            ? "No transactions found for this month."
            : "No transactions yet. Add one to find out why you are broke."}
        </p>
      ) : (
        <div className="transactionList">
          {filteredTransactions.map((transaction) => (
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

                <div className="transactionActions">
                  <button
                    type="button"
                    className="editBtn"
                    onClick={() => startEdit(transaction)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="deleteBtn"
                    onClick={() => deleteTransaction(transaction.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}