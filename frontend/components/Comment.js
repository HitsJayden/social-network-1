import React, { Component } from 'react';

import DeleteComment from './DeleteComment';

class Comment extends Component {
    constructor(props) {
        super(props) 

        this.state = {
            message: null,
            content: '',
            comments: [],
            totalComments: null,
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
        });

        const resData = await res.json();

        if(resData.err) {
            console.log(err);
        };

        this.setState({ totalComments: resData.totalComments, comments: resData.comments.map(comment => {
            return (
                <>
                <p key={comment._id}>{comment.content}</p>
                <DeleteComment postId={this.props.postId} commentId={comment._id} />
                </>
            );
        }) })
    }

    fetchData = async () => {
        const postId = this.props.postId;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/comment/${postId}`, {
            method: 'PUT',

            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                content: this.state.content,
            })
        });

        const resData = await res.json();
        
        if(resData.err) {
            console.log(err);
        };

        this.setState({ message: resData.message });
    };

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    componentDidMount() {
        this.fetchComments();
    }

    render() {
        return(
            <>
            <textarea onChange={this.handleChange} value={this.state.content} name="content" placeholder="What Are You Thinking?" cols="10" rows="5"></textarea>
            <button onClick={this.fetchData}>Submit</button>
            <p>There {this.state.totalComments > 1 || 
            this.state.totalComments === 0 ? 'Are' : 'Is'} {this.state.totalComments} Comment{this.state.totalComments > 1 ? 's': ''} On This Post</p>
            {this.state.comments}
            </>
        )
    }
}

export default Comment;