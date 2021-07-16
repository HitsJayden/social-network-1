import React, { Component } from 'react';

import Like from './Like';
import Comment from './Comment';
import Header from './Header';

class ViewPost extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            content: '',
            image: null,
            likes: 0,
            createdAt: '',
        };

        this.fetchData = this.fetchData.bind(this);
    }

    fetchData = async () => {
        try {
            this.setState({ loading: true });
            const postId = this.props.postId;
    
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/view-post/${postId}`, {
                method: 'GET',
    
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });
    
            const resData = await res.json(); 
            this.setState({ loading: false, content: resData.content, likes: resData.likes, image: resData.image });
        } catch (err) {
            console.log(err);
        };
    };

    componentDidMount() {
        this.fetchData();
    };

    render() {
        return ( 
            <>
            <Header />

            {this.state.loading && <h1>Loading...</h1>}

            {!this.state.loading && (
                <div key={this.props.postId}>
                    <h1>Created At: {this.state.createdAt.slice(0, 10)} At: {this.state.createdAt.slice(11, 16)}</h1>
            
                    <figure>
                        <img src={this.state.image} alt={this.state.content} />
                    </figure>
                                
                    <p>{this.state.content}</p>
                    <Like postId={this.props.postId} />
                    <p>{this.state.likes} {this.state.likes === 1 ? 'person' : 'people'} like this post</p>
                    <Comment postId={this.props.postId} />
                </div>
            )}
            </>  
        )
    }
}

export default ViewPost;