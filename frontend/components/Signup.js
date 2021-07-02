import React, { Component } from 'react';

import Header from '../components/Header';

class Signup extends Component {
    state = {
        email: '',
        name: '',
        surname: '',
        nickname: '',
        password: '',
        confirmPassword: '',
        loading: false,
        message: null,
    }

    // handling errors and inputs
    handleInputs = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    signupHandler = e => {
        e.preventDefault();
        this.setState({ loading: true });
        this.fetchData();
    };

    fetchData = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
            method: 'PUT',

            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },

            credentials: 'include',
            body: JSON.stringify({
                name: this.state.name,
                surname: this.state.surname,
                nickname: this.state.nickname,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword,
                email: this.state.email,
            }),
        });

        const resData = await res.json(); console.log(resData)

        this.setState({ message: resData.message, loading: false });

        if(resData.err) {
            console.log(err);
        };
    };

    render() {
        return (
            <>

            <Header />

            {/* showing error/messages */}
            {this.state.message && <h1>{this.state.message}</h1>}

            <form onSubmit={this.signupHandler}>
                <fieldset aria-busy={this.state.loading} disabled={this.state.loading}>

                    <h1>Sign{this.state.loading ? 'ing': ''} Up For An Account</h1>

                    <label htmlFor="email">
                        Email

                        <input 
                            className={this.state.message === 'Invalid Email' ? 'invalid' : ''}
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
                        />
                    </label>

                    <button>Sign{this.state.loading ? 'ing' : ''} Up!</button>

                </fieldset>
            </form>

            </>
        )
    }
}

export default Signup;