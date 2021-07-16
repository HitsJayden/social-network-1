import React, { Component } from 'react';
import Link from 'next/link';
import Header from './Header';

class Settings extends Component {
    state = {
        name: '',
        password: '',
        newPassword: '',
        confirmPassword: '',
        email: '',
        nickname: '',
        surname: '',
        message: null,
        loading: false,
    };

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    fetchData = async e => {
        try {
            this.setState({ loading: true });
            e.preventDefault();

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/settings`, {
                method: 'PATCH',
    
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: this.state.name,
                    password: this.state.password,
                    newPassword: this.state.newPassword,
                    confirmPassword: this.state.confirmPassword,
                    email: this.state.email,
                    nickname: this.state.nickname,
                    surname: this.state.surname,
                })
            });
    
            const resData = await res.json();
            this.setState({ loading: false, message: resData.message });
        } catch (err) {
            console.log(err);
        };
    };

    render() {
        return (
            <>
            <Header />

            <h1>{this.state.message}</h1>

            <form onSubmit={this.fetchData}>
                <fieldset aria-busy={this.state.laoding} disabled={this.state.loading}>

                    <h1>Chang{this.state.loading ? 'ing' : 'e'} Your Details</h1>

                    <label htmlFor="email">
                        Email

                        <input
                            name="email"
                            type="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            placeholder="Please Enter Your Email If You Want To Change It"
                        />
                    </label>

                    <label htmlFor="name">
                        Name

                        <input
                            name="name"
                            type="text"
                            value={this.state.name}
                            onChange={this.handleChange}
                            placeholder="Please Enter Your Name If You Want To Change It"
                        />
                    </label>

                    <label htmlFor="surname">
                        Surname 

                        <input
                            name="surname"
                            type="text"
                            value={this.state.surname}
                            onChange={this.handleChange}
                            placeholder="Please Enter Your Surname If You Want To Change It"
                        />
                    </label>

                    <label htmlFor="nickname">
                        Nickname

                        <input
                            name="nickname"
                            type="text"
                            value={this.state.nickname}
                            onChange={this.handleChange}
                            placeholder="Please Enter Your Nickname If You Want To Change It"
                        />
                    </label>

                    <label htmlFor="newPassword">
                        New Password

                        <input
                            name="newPassword"
                            type="password"
                            value={this.state.newPassword}
                            onChange={this.handleChange}
                            placeholder="Please Enter Your New Password If You Want To Change It"
                        />
                    </label>

                    <label htmlFor="confirmPassword">
                        Confirm New Password

                        <input
                            name="confirmPassword"
                            type="password"
                            value={this.state.confirmPassword}
                            onChange={this.handleChange}
                            placeholder="Please Confirm Your New Password If You Want You Changed It"
                        />
                    </label>

                    <label htmlFor="password">
                        Enter Your Password In Order To Change Details

                        <input
                            name="password"
                            type="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            placeholder="Please Confirm Your Password In Order To Change Details"
                        />
                    </label>

                    <button>Chang{this.state.loading ? 'ing' : 'e'} Your Details</button>
                    <Link href="/reset-password"><button>Forgot Password?</button></Link>
                </fieldset>
            </form>
            </>
        )
    }
};

export default Settings;