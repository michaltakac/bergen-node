import React, { Component } from "react";
import AuthForm from "./AuthForm";

import "./app.css";

function Link({ index }) {
  return (
    <li style={{ lineHeight: "2rem", fontSize: "1.2rem" }}>
      <a href={`https://matematika.fberg.tuke.sk/matematikai/serie/seria_ing_${index}.pdf`}>Séria úloh {index}</a>
    </li>
  );
}

class App extends Component {
  state = {
    isAuthorized: false,
  };

  componentDidMount() {
    if (typeof window !== "undefined" && !this.state.isAuthorized) {
      const fbergMath1SerieAuth = localStorage.getItem("fbergMath1SerieAuth");
      const auth = JSON.parse(fbergMath1SerieAuth);

      if (auth && auth.uid) {
        const nowInMs = new Date().getTime();

        if (auth.loginTime + auth.expiresIn > nowInMs) {
          this.setState({ isAuthorized: true });
        }
      }
    }
  }

  renderLinkList = () => {
    let links = [];
    for (let i = 1; i < 22; i++) {
      links.push(<Link key={i} index={i} />);
    }
    return <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>{links}</ul>;
  };

  render() {
    if (!this.state.isAuthorized) {
      return <AuthForm />;
    }

    return (
      <section style={{ textAlign: "center" }}>
        <h1 style={{ marginBottom: "-35px" }}>Série úloh z predmetu Matematika I</h1>
        <h2>FBERG TUKE</h2>
        {this.renderLinkList()}
      </section>
    );
  }
}

export default App;
