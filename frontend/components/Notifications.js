import React, { Component } from 'react';
import cookie from 'react-cookies';

import { FaBell } from 'react-icons/fa';

class Notifications extends Component {
    constructor(props) {
        super(props) 

        this.state = {
            notifications: [],
            getNotifications: false,
        };

        this.fetchData = this.fetchData.bind(this);
    }

    notifications = () => {
        this.setState({ getNotifications: !this.state.getNotifications });
    };

    fetchData = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/notifications`, {
            method: 'GET',

            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
        });

        const resData = await res.json(); 

        this.setState({ notifications: resData.notifications.map(notification => {
            return (
                <div>
                    <h1>{notification.message}</h1>
                    {notification.message.includes('Sent You A Friend Request') ? <><button>Accept</button> <button>Decline</button></> : ''}
                </div>
            )
        }) });
    };

    componentDidMount() {
        this.fetchData();
    };

    render() {
        return (
            <>
            {cookie.load('authCookie') && <button onClick={this.notifications}><FaBell /></button>}
            {this.state.getNotifications && this.state.notifications}
            </>
        )
    }
};

export default Notifications;