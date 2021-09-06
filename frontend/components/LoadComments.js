import React, { Component } from 'react';

import DeleteComment from './DeleteComment';

import LoadCommentsDiv from './styles/LoadCommentsStyle';

class LoadComments extends Component {
    constructor(props) {
        super(props) 

        this.state = {
            message: null,
            content: '',
            comments: [],
            name: '',
            surname: '',
            nickname: '',
            loadComments: false, // this will be used in order to don't show the button load comment once clicked
        };

        this.fetchComments = this.fetchComments.bind(this);
    }

    fetchComments = async () => {
        try {
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
    
            this.setState({ loadComments: true ,comments: resData.comments.map(comment => {
                return (
                    <LoadCommentsDiv key={comment._id}>
                        <DeleteComment postId={this.props.postId} userId={comment.userId} commentId={comment._id} />
                        <p>{comment.name} {comment.surname} <b>{comment.nickname}</b></p>
                        <p key={comment._id}>{comment.content}</p>
                    </LoadCommentsDiv>
                );
            }) });
        } catch (err) {
            console.log(err);
        };
    };

    render() {
        return(
            <>
            {this.props.totalComments > 0 && !this.state.loadComments && (
                <button onClick={this.fetchComments}>Load Comment{this.props.totalComments > 1 ? 's' : ''}</button>
            )}
            {this.state.comments}
            </>
        )
    };
};

export default LoadComments;