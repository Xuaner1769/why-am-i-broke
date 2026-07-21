export default function LoginPage({
  authMode,
  setAuthMode,
  authData,
  handleAuthChange,
  handleLogin,
  handleRegister,
}) {
  return (
    <section className="authWrapper">
      <div className="authCard">
        <p className="tag">Personal Finance Tracker</p>

        <h1>WhyAmIBroke?</h1>

        <p className="heroText">
          Login to track where your money disappeared.
        </p>

        <div className="authTabs">
          <button
            type="button"
            className={authMode === "login" ? "activeTab" : ""}
            onClick={() => setAuthMode("login")}
          >
            Login
          </button>

          <button
            type="button"
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
            <button
              type="button"
              className="submitBtn"
              onClick={handleLogin}
            >
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
  );
}