import React, { Component } from 'react';

import Header from '../components/Header';

import FormDiv from "./styles/FormStyle";

class VerifyAccount extends Component {
    state = {
        loading: false,
        message: null,
        password: '',
    };

    handleChange = e => {
        this.setState({ password: e.target.value });
    };

    fetchData = async e => {
        try {
            e.preventDefault();
            this.setState({ loading: true });
    
            const userId = this.props.userId;
            const tokenVerifyEmail = this.props.tokenVerifyEmail;
    
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-account/${encodeURIComponent(tokenVerifyEmail)}/${userId}`, {
                method: 'PATCH',
    
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
    
                credentials: 'include',
                body: JSON.stringify({
                    password: this.state.password,
                })
            });
    
            const resData = await res.json();
    
            this.setState({ message: resData.message, loading: false });
    
            if(this.state.message === 'Sorry, The Account Was Deleted' || 
            this.state.message === 'Sorry, Something Went Wrong. Please Signup Again, You Are Being Redirected To The Sign Up Page') {
                setTimeout(() => {
                    window.location.replace('/auth/signup');
                }, 2000);
            }
    
            if(this.state.message === 'Thank You For Verifying Your Account, You Are Being Redirected To The Login Page') {
                setTimeout(() => {
                    window.location.replace('/auth/login');
                }, 2000);
            };
        } catch (err) {
            console.log(err);
        };
    };

    render() {
        return (
          <>
            <Header />

            <FormDiv>
              {this.state.message && <h1>{this.state.message}</h1>}

              <form onSubmit={this.fetchData}>
                <fieldset
                  aria-busy={this.state.loading}
                  disabled={this.state.loading}
                >
                  <h1>Verify{this.state.loading ? "ing" : ""} Your Account</h1>

                  <label htmlFor="password">
                    Password
                    <input
                      name="password"
                      type="password"
                      onChange={this.handleChange}
                      value={this.state.password}
                      placeholder="Please Enter Your Password"
                    />
                  </label>

                  <button>
                    Verify{this.state.loading ? "ing" : ""} Your Account
                  </button>
                </fieldset>
              </form>
            </FormDiv>
          </>
        );
    }
}

export default VerifyAccount;