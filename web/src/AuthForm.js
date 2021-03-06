const React = require("react");

export default class AuthForm extends React.Component {
  state = {
    username: null,
    password: null,
    error: null,
  };
  handleUsernameChange = e => {
    this.setState({
      ...this.state,
      username: e.target.value,
    });
  };
  handlePwdChange = e => {
    this.setState({
      ...this.state,
      password: e.target.value,
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    const { username, password } = this.state;

    fetch(`https://matematika.fberg.tuke.sk/api/v1/check-student-exists.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }

        this.setState({
          ...this.state,
          error: "Skontrolujte prihlasovacie meno a heslo. Uživateľ s týmito údajmi neexistuje.",
        });
        return Promise.reject(response);
      })
      .then(data => {
        if (data.count !== 0) {
          const uid = data[0].uid[0];
          const auth = {
            uid,
            loginTime: new Date().getTime(),
            expiresIn: 2629746000, // 1 mesiac
          };

          localStorage.setItem("fbergMath1SerieAuth", JSON.stringify(auth));
          this.setState({
            username: null,
            password: null,
            error: null,
          });

          window.location.reload(false);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  render() {
    return (
      <section className="auth-body">
        <h1 style={{ marginBottom: "-35px" }}>Matematika</h1>
        <h2>FBERG TUKE</h2>

        <form onSubmit={this.handleSubmit} className="auth-form">
          <div>
            <label>
              Jedinečný login
              <br />
              (cez rovnaký sa prihlasuješ do MAISu):
            </label>
            <input name="username" type="text" placeholder="V tvare ab123xy" onChange={this.handleUsernameChange} />
          </div>
          <div>
            <label>Heslo:</label>
            <input name="pwd" type="password" onChange={this.handlePwdChange} placeholder="Heslo do MAISu" />
          </div>
          <div>
            <button type="submit">Prihlásiť sa</button>
          </div>
          <div style={{ marginTop: "30px" }}>{this.state.error}</div>
        </form>

        <p>
        <br/>
        <br/>
        &copy; {new Date().getFullYear()} FBERG TUKE
      </p>
      </section>
    );
  }
}

