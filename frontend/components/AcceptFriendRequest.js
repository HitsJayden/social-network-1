import React, { Component } from 'react';

class AcceptFriendRequest extends Component {
    state = {
        message: null,
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
    };

    render() {
        return (
            <button onClick={this.acceptFriend}>Accept</button>
        )
    }
}

export default AcceptFriendRequest;