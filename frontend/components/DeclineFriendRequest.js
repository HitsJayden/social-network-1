import { includes } from 'lodash';
import React, { Component } from 'react';

class DeclineFriendRequest extends Component {
    state = {
        message: null,
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
    }

    render() {
        return (
            <>
            <h1>{this.state.message}</h1>
            <button onClick={this.declineRequest}>Decline</button>
            </>
        )
    }
}

export default DeclineFriendRequest;