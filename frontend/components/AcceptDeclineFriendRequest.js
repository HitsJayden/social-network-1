import React, { Component } from 'react';

class AcceptDeclineFriendRequest extends Component {
    state = {
        message: null,
        accepted: false,
        declined: false,
    };

    declineRequest = async () => {
        try {
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

            // when scrolls changes we save it in local storage, reload the page and then go again to the same scroll
            localStorage.setItem('scrollPosition', window.scrollY);
            window.location.reload();
            window.scrollTo(0, localStorage.getItem('scrollPosition'));
        } catch (err) {
            console.log(err);
        };
    };

    acceptFriend = async () => {
        try {
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
    
            if(this.state.message.includes('You Accepted')) {
                this.setState({ accepted: true, declined: true });
            };

            // when scrolls changes we save it in local storage, reload the page and then go again to the same scroll
            localStorage.setItem('scrollPosition', window.scrollY);
            window.location.reload();
            window.scrollTo(0, localStorage.getItem('scrollPosition'));
        } catch (err) {
            console.log(err);
        };
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