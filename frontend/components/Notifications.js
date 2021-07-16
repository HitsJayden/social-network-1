import React, { Component } from 'react';
import Link from 'next/link';

import { FaBell } from 'react-icons/fa';
import AcceptDeclineFriendRequest from './AcceptDeclineFriendRequest';

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
        try {
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
                    /* based on the type of notification we will give the user a different link */
                    <div>
                        {notification.message.includes('Post') && <Link href={`/auth/view-post/${notification.postId}`}>
                            <h1>{notification.message}</h1>
                        </Link> }
                        {notification.message.includes('Accepted Your Friend Request') && 
                        <Link href={`/auth/load-profile/${notification.userId}`}><h1>{notification.message}</h1></Link>}
                        {notification.message.includes('Sent You A Friend Request') ? <>
                            <h1>{notification.message}</h1>
                            <AcceptDeclineFriendRequest userId={notification.userId} /> </> : ''}
                    </div>
                )
            }) });
        } catch (err) {
            console.log(err);
        };
    };

    componentDidMount() {
        this.fetchData();
    };

    render() {
        return (
            <>
            <button onClick={this.notifications}><FaBell /></button>
            {this.state.getNotifications && this.state.notifications}
            {this.state.getNotifications && this.state.notifications === [] && (
                <div>
                    <h1>You Don't Have Any Notifications</h1>
                </div>
            )}
            </>
        )
    }
};

export default Notifications;