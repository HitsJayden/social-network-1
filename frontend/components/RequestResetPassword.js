import React, { Component } from 'react';

import Header from '../components/Header';

class RequestResetPassword extends Component {
    state = {
        email: '',
        message: null,
        loading: false,
    };

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    fetchData = async e => {
        try {
            e.preventDefault();
            this.setState({ loading: true });
    
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reset-password`, {
                method: 'PATCH',
    
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.email,
                }),
                credentials: 'include',
            });
    
            const resData = await res.json();
            this.setState({ message: resData.message, loading: false });
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

                    <h1>Request{this.state.loading ? 'ing' : ''} A New Password</h1>

                    <label htmlFor="email">
                        Email

                        <input
                            name="email"
                            type="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            placeholder="Please Enter Your Email"
                        />
                    </label>

                    <button>Request{this.state.loading ? 'ing' : ''} A New Password</button>

                </fieldset>
            </form>

            </>
        )
    }
};

export default RequestResetPassword;