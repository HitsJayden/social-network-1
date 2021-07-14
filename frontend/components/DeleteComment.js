import React, { Component } from 'react';

class DeleteComment extends Component {
    state = {
        message: null,
    };

    deleteComment = async () => {
        const commentId = this.props.commentId;
        const postId = this.props.postId;

        setTimeout(() => {
            window.location.reload();
        }, 500);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/delete-comment/${commentId}/${postId}`, {
            method: 'DELETE',

            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
        });

        const resData = await res.json();

        if(resData.err) {
            console.log(resData.err);
        };

        this.setState({ message: resData.message });
        console.log(resData.message)
    };

    render() {
        return(
            <>
            <h1>{this.state.message}</h1>
            <button onClick={this.deleteComment} aria-label="delete comment">X</button>
            </>
        )
    }
};

export default DeleteComment;