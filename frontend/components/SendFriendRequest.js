import React, { Component } from 'react';

class SendFriendRequest extends Component {
    state = {
        message: null,
    }
    
    sendFriendRequest = async () => {
        const userId = this.props.userId;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/send-friend-request/${userId}`, {
            method: 'PUT',

            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include'
        });
        const resData = await res.json();

        if(resData.err) {
            console.log(resData.err);
        };

        this.setState({ message: resData.message });
    };

    render() {
        return(
            <>
            {this.state.message && <h1>{this.state.message}</h1>}
            <button onClick={this.sendFriendRequest}>Send Friend Request</button>
            </>
        )
    }
}

export default SendFriendRequest;