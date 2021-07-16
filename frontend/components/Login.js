import React, { Component } from 'react';
import Link from 'next/link';

import Header from '../components/Header';

class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            message: null,
            loading: false,
        };

        this.fetchData = this.fetchData.bind(this);
    }

    handleInputs = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    loginHandler = e => {
        e.preventDefault();
        this.setState({ loading: true });
        this.fetchData();
    };

    fetchData = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                method: 'POST',
    
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
    
                credentials: 'include',
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                }),
            });
    
            const resData = await res.json(); 
            this.setState({ message: resData.message, loading: false });
    
            // we only want to show the user one of these messages
            if(resData.message !== 'Invalid Password, Please Try Again Or Request A Reset Password' && 
            resData.message !== 'There Is No Account In Our Database With The Following Email: ' + this.state.email &&
            resData.message !== 'Please Verify Your Account By Checking Your Email' && 
            resData.message !== 'Successful Login, You Are Being Redirected To The Home') {
                this.setState({ message: null });
            };
    
            if(resData.message === 'Successful Login, You Are Being Redirected To The Home') {
                setTimeout(() => {
                    window.location.replace('/');
                }, 2000);
            };
        } catch (err) {
            console.log(err);
        };
    };

    render() {
        return(
            <>

            <Header />

            {this.state.message && <h1>{this.state.message}</h1>}

            <form onSubmit={this.loginHandler}>
                <fieldset aria-busy={this.state.loading} disabled={this.state.loading}>

                    <h1>Log{this.state.loading ? 'ging' : ''} In</h1>

                    <label htmlFor="email">
                        Email

                        <input
                            name="email"
                            type="email"
                            placeholder="Please Enter Your Email"
                            value={this.state.email}
                            onChange={this.handleInputs}
                        />

                    </label>

                    <label htmlFor="password">
                        Password

                        <input
                            name="password"
                            type="password"
                            placeholder="Please Enter Your Password"
                            value={this.state.password}
                            onChange={this.handleInputs}
                        />

                    </label>

                    <button>Log{this.state.loading ? 'ging' : ''} In</button>

                    <Link href="/reset-password"><button>Reset Password</button></Link>

                </fieldset>
            </form>

            </>
        )
    }
};

export default Login;