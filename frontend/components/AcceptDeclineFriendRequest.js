import React, { Component } from 'react';

class AcceptDeclineFriendRequest extends Component {
    state = {
        message: null,
        accepted: false,
        declined: false,
    };

    declineRequest = async () => {
        const userId = this.props.userId;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/decline-friend/${userId}`, {
            method: 'PATCH',

            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
        });

        const resData = await res.json();

        this.setState({ message: resData.message });

        if(this.state.message.includes('You Declined')) {
            this.setState({ accepted: true, declined: true });
        };
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    acceptFriend = async () => {
        const userId = this.props.userId;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/accept-friend/${userId}`, {
            method: 'PATCH',

            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
        });

        const resData = await res.json();
        this.setState({ message: resData.message });

        if(this.state.message.includes('You Declined')) {
            this.setState({ accepted: true, declined: true });
        };
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    render() {
        return (
            <>
            <h1>{this.state.message}</h1>
            {!this.state.accepted && !this.state.declined && <button onClick={this.acceptFriend}>Accept</button>}
            {!this.state.accepted && !this.state.declined && <button onClick={this.declineRequest}>Decline</button>}
            </>
        )
    }
}

export default AcceptDeclineFriendRequest;