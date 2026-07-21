export default function Navbar({ user, onLogout }) {
  return (
    <header className="navbar">
      <div className="navbarLeft">
        <div className="logoBox">
          💳
        </div>

        <div>
          <h2>WhyAmIBroke?</h2>
          <p>Personal Finance Tracker</p>
        </div>
      </div>

      <div className="navbarRight">
        <span>Hello, {user.email}</span>

        <button
          className="logoutBtn"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}