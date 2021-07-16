import React, { Component } from 'react';

import Header from '../components/Header';

class RequestPasswordPage extends Component {
    state = {
        loading: false,
        message: null,
        password: '',
        confirmPassword: '',
    };

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    fetchData = async e => {
        try {
            e.preventDefault();
            this.setState({ loading: true });
    
            const resetToken = this.props.resetToken;
            const userId = this.props.userId
    
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reset-password-form/${encodeURIComponent(resetToken)}/${userId}`, {
                method: 'PATCH',
    
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
    
                credentials: 'include',
                body: JSON.stringify({
                    password: this.state.password,
                    confirmPassword: this.state.confirmPassword,
                })
            });
    
            const resData = await res.json();    
            this.setState({ loading: false, message: resData.message });
    
            // redirecting to login page if no errors are found
            if(this.state.message === 'You Have Changed Your Password, You Are Being Redirected To The Login Page') {
                setTimeout(() => {
                    window.location.replace('/auth/login');
                }, 2000);
            };
    
            // redirecting to reset password page in case of errors
            if(this.state.message === 'Sorry, We Could Not Find An Account, Please Request Another Password Reset. You Are Being Redirected To The Page' ||
            this.state.message === 'Forbidden! Please Request Another Password Reset, You Are Being Redirected To The page') {
                setTimeout(() => {
                    window.location.replace('/reset-password');
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

            <form onSubmit={this.fetchData}>
                <fieldset aria-busy={this.state.loading} disabled={this.state.loading}>

                    <h1>Chang{this.state.loading ? 'ing' : 'e'} Your Password</h1>

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

                    <label htmlFor="confirmPassword">
                        Confirm Password

                        <input
                            name="confirmPassword"
                            type="password"
                            onChange={this.handleChange}
                            value={this.state.confirmPassword}
                            placeholder="Please Confirm Your Password"
                        />
                    </label>

                    <button>Chang{this.state.loading ? 'ing' : 'e'} Your Password</button>

                </fieldset>
            </form>

            </>
        )
    }
};

export default RequestPasswordPage;