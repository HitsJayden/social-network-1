import React, { Component } from 'react';
import cookie from 'react-cookies';

import { FaTrashAlt } from 'react-icons/fa';

class DeleteComment extends Component {
    state = {
        message: null,
    };

    deleteComment = async () => {
        try {
            const commentId = this.props.commentId;
            const postId = this.props.postId;
    
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/delete-comment/${commentId}/${postId}`, {
                method: 'DELETE',
    
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });

            const resData = await res.json();
            this.setState({ message: resData.message });

            // when scrolls changes we save it in local storage, reload the page and then go again to the same scroll
            localStorage.setItem('scrollPosition', window.scrollY);
            window.location.reload();
            window.scrollTo(0, localStorage.getItem('scrollPosition'));
        } catch (err) {
            console.log(err);
        };
    };

    render() {
        return(
            <>
            <h1 class="message">{this.state.message}</h1>
            {cookie.load('userId').toString() === this.props.userId.toString() && 
                <button class="delete-comment" onClick={this.deleteComment} aria-label="delete comment"><FaTrashAlt /></button>
            }
            </>
        )
    }
};

export default DeleteComment;