export default function CategoryChart({
  selectedMonth,
  formatMonth,
  categoryChartData,
}) {
  return (
    <section className="chartCard">
      <div className="chartHeader">
        <div>
          <h2>Spending by Category</h2>

          <p>
            {selectedMonth
              ? `Expense breakdown for ${formatMonth(selectedMonth)}`
              : "Expense breakdown for all transactions"}
          </p>
        </div>
      </div>

      {categoryChartData.length === 0 ? (
        <p className="emptyText">No expense data to show yet.</p>
      ) : (
        <div className="categoryChart">
          {categoryChartData.map((item) => (
            <div className="categoryRow" key={item.category}>
              <div className="categoryInfo">
                <span>{item.category}</span>
                <strong>RM {item.amount.toFixed(2)}</strong>
              </div>

              <div className="barTrack">
                <div
                  className="barFill"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>

              <p>{item.percentage.toFixed(0)}% of spending</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}