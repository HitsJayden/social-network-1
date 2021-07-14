import React, { Component } from 'react';

import DeleteComment from './DeleteComment';

class LoadComments extends Component {
    constructor(props) {
        super(props) 

        this.state = {
            message: null,
            content: '',
            comments: [],
        };

        this.fetchComments = this.fetchComments.bind(this);
    }

    fetchComments = async () => {
        const postId = this.props.postId;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/load-comments/${postId}`, {
            method: 'GET',

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

        this.setState({ comments: resData.comments.map(comment => {
            return (
                <div key={comment._id}>
                    <p key={comment._id}>{comment.content}</p>
                    <DeleteComment postId={this.props.postId} commentId={comment._id} />
                </div>
            );
        }) });
    };

    render() {
        return(
            <>
            {this.props.totalComments > 0 && (
                <button onClick={this.fetchComments}>Load Comment{this.props.totalComments > 1 ? 's' : ''}</button>
            )}
            {this.state.comments}
            </>
        )
    };
};

export default LoadComments;