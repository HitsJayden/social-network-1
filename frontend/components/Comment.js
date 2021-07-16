import React, { Component } from 'react';

import LoadComments from './LoadComments';

class Comment extends Component {
    state = {
        message: null,
        content: '',
        totalComments: 0,
    };

    totalComments = async () => {
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
            this.setState({ totalComments: resData.totalComments });
        } catch (err) {
            console.log(err);
        };
    };

    fetchData = async () => {
        try {
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
            this.setState({ message: resData.message });

            // when scrolls changes we save it in local storage, reload the page and then go again to the same scroll
            localStorage.setItem('scrollPosition', window.scrollY);
            window.location.reload();
            window.scrollTo(0, localStorage.getItem('scrollPosition'));
        } catch (err) {
            console.log(err);
        };
    };

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    componentDidMount() {
        this.totalComments();
    };

    render() {
        return(
            <>
            <textarea onChange={this.handleChange} value={this.state.content} name="content" placeholder="What Are You Thinking?" 
            cols="10" rows="5"></textarea>
            {this.state.message && <h1>{this.state.message}</h1>}
            <button onClick={this.fetchData}>Submit</button>
            <p>There {this.state.totalComments > 1 || this.state.totalComments === 0 ? 
            'Are' : 'Is'} {this.state.totalComments} Comment{this.state.totalComments > 1 ? 's': ''} On This Post</p>
            <LoadComments totalComments={this.state.totalComments} postId={this.props.postId} />
            </>
        )
    }
}

export default Comment;