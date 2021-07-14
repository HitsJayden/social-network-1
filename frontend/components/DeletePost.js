import React, { Component } from 'react';

class DeletePost extends Component {
    state = {
        message: null,
    };

    deletePost = async () => {
        const postId = this.props.postId;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/delete-post/${postId}`, {
            method: 'DELETE',

            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
        });

        const resData = await res.json(); 
        this.setState({ message: resData.message });
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    render() {
        return(
            <>
            <h1>{this.state.message}</h1>
            <button onClick={this.deletePost} aria-label="delete post">X</button>
            </>
        )
    }
}

export default DeletePost;