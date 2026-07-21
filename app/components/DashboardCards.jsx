export default function DashboardCards({
  selectedMonth,
  formatMonth,
  historyIncome,
  historyExpense,
  historyBalance,
  topCategory,
}) {
  return (
    <section className="statsGrid">
      <div className="statCard">
        <p>
          {selectedMonth
            ? `${formatMonth(selectedMonth)} Income`
            : "Total Income"}
        </p>

        <h2>RM {historyIncome.toFixed(2)}</h2>
      </div>

      <div className="statCard">
        <p>
          {selectedMonth
            ? `${formatMonth(selectedMonth)} Spent`
            : "Total Spent"}
        </p>

        <h2>RM {historyExpense.toFixed(2)}</h2>
      </div>

      <div className="statCard">
        <p>
          {selectedMonth
            ? `${formatMonth(selectedMonth)} Net`
            : "Net Amount"}
        </p>

        <h2>RM {historyBalance.toFixed(2)}</h2>
      </div>

      <div className="statCard">
        <p>Top Spending</p>
        <h2>{topCategory}</h2>
      </div>
    </section>
  );
}