import React, { Component } from 'react';

class Like extends Component {
    like = async () => {
        const postId = this.props.postId;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/like/${postId}`, {
            method: 'PATCH',

            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
        });

        await res.json();
    }

    render() {
        return <button onClick={this.like}>like</button>
    }
};

export default Like;