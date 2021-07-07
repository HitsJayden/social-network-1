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

        window.location.replace('/auth/login');
        const resData = await res.json();

        if(resData.err) {
            console.log(resData.err);
        };
    };

    render() {
        return (
            <button onClick={this.logout}>Logout</button>
        )
    }
};

export default Logout;