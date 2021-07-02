import React, { Component } from 'react';

class Logout extends Component {
    logout = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
            method: 'DELETE',

            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },

            credentials: 'include',
        });

        return window.location.replace('/auth/login');
    };

    render() {
        return (
            <button onClick={this.logout}>Logout</button>
        )
    }
};

export default Logout;