export default function HeroCard({ overallBalance }) {
  return (
    <div className="heroCard">
      <p>All Time</p>
      <h2>RM {overallBalance.toFixed(2)}</h2>
      <span>Overall balance</span>
    </div>
  );
}