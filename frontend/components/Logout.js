import React, { Component } from 'react';

class Logout extends Component {
    logout = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
                method: 'DELETE',
    
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
    
                credentials: 'include',
            });
    
            window.location.replace('/auth/login');
            await res.json();
        } catch (err) {
            console.log(err);
        };
    };

    render() {
        return (
            <button onClick={this.logout}>Logout</button>
        )
    }
};

export default Logout;