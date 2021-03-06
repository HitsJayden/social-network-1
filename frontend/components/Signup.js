import React, { Component } from "react";

import Header from "../components/Header";

import FormDiv from "./styles/FormStyle";

class Signup extends Component {
  state = {
    email: "",
    name: "",
    surname: "",
    nickname: "",
    password: "",
    confirmPassword: "",
    loading: false,
    message: null,
  };

  // handling errors and inputs
  handleInputs = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  signupHandler = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    this.fetchData();
  };

  fetchData = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          credentials: "include",
          body: JSON.stringify({
            name: this.state.name,
            surname: this.state.surname,
            nickname: this.state.nickname,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            email: this.state.email,
          }),
        }
      );

      const resData = await res.json();

      this.setState({ message: resData.message, loading: false });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <>
        <Header />
        <FormDiv>
          {/* showing error/messages */}
          {this.state.message && (
            <h1
              id="message"
              className={
                this.state.message === "Invalid Email" ||
                this.state.message ===
                  "User " + this.state.email + " Already Exists" ||
                this.state.message === "Please Enter Your Name" ||
                this.state.message === "Please Enter Your Surname" ||
                this.state.message ===
                  "Password Needs To Be At Least 5 Characters" ||
                this.state.message === "Passwords Do Not Match"
                  ? "red"
                  : ""
              }
            >
              {this.state.message}
            </h1>
          )}

          <form onSubmit={this.signupHandler}>
            <fieldset
              aria-busy={this.state.loading}
              disabled={this.state.loading}
            >
              <h1>Sign{this.state.loading ? "ing" : ""} Up For An Account</h1>

              <label htmlFor="email">
                Email
                <input
                  className={
                    this.state.message === "Invalid Email" ||
                    this.state.message ===
                      "User " + this.state.email + " Already Exists"
                      ? "invalid"
                      : ""
                  }
                  type="email"
                  name="email"
                  placeholder="Enter Your Email"
                  value={this.state.email}
                  onChange={this.handleInputs}
                />
              </label>

              <label htmlFor="name">
                Name
                <input
                  type="text"
                  name="name"
                  placeholder="Please Enter Your Name"
                  value={this.state.name}
                  onChange={this.handleInputs}
                  className={
                    this.state.message === "Please Enter Your Name"
                      ? "invalid"
                      : ""
                  }
                />
              </label>

              <label htmlFor="surname">
                Surname
                <input
                  type="text"
                  name="surname"
                  placeholder="Please Enter Your Surname"
                  value={this.state.surname}
                  onChange={this.handleInputs}
                  className={
                    this.state.message === "Please Enter Your Surname"
                      ? "invalid"
                      : ""
                  }
                />
              </label>

              <label htmlFor="nickname">
                Nickname (optional)
                <input
                  type="text"
                  name="nickname"
                  placeholder="Please Enter Your Nickname"
                  value={this.state.nickname}
                  onChange={this.handleInputs}
                />
              </label>

              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="Please Enter Your Password"
                  value={this.state.password}
                  onChange={this.handleInputs}
                  className={
                    this.state.message ===
                    "Password Needs To Be At Least 5 Characters"
                      ? "invalid"
                      : ""
                  }
                />
              </label>

              <label htmlFor="confirmPassword">
                Confirm Password
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Please Confirm Your Password"
                  value={this.state.confirmPassword}
                  onChange={this.handleInputs}
                  className={
                    this.state.message === "Passwords Do Not Match"
                      ? "invalid"
                      : ""
                  }
                />
              </label>

              <button>Sign{this.state.loading ? "ing" : ""} Up!</button>
            </fieldset>
          </form>
        </FormDiv>
      </>
    );
  }
}

export default Signup;