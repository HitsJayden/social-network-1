import React, { Component } from 'react';

import Header from './Header';
import Like from './Like';
import Comment from './Comment';
import UpdateProfileImage from './UpdateProfileImage';
import CreatePost from './CreatePost';

class MyProfilePage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            posts: [],
            profileImage: '',
        };

        this.fetchData = this.fetchData.bind(this);
    }

    fetchData = async () => {
        this.setState({ loading: true });

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/my-profile`, {
            method: 'GET',

            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
        });

        const resData = await res.json(); console.log(resData)

        if(resData.err) {
            console.log(resData.err);
        };

        this.setState({ name: resData.name, surname: resData.surname, nickname: resData.nickname,
             loading: false, profileImage: resData.profileImage, posts: resData.userPosts.map(post => {
            return (
                <div>
                    <h1>Created At: {post.createdAt.slice(0, 10)} At: {post.createdAt.slice(11, 16)}</h1>

                    <figure>
                        <img src={post.image} alt={post.content} />
                    </figure>
                    
                    <p>{post.content}</p>
                    <Like postId={post._id} />
                    <p>{post.likes.likes} {post.likes.likes === 1 ? 'person' : 'people'} like this post</p>
                    <Comment postId={post._id} />
                </div>
            )
        }) });
    };

    componentDidMount() {
        this.fetchData();
    };

    render() {
        return(
            <>
            <Header />

            {this.state.loading && <h1>Loading...</h1>}

            {!this.state.loading && (
                <>
                <UpdateProfileImage />

                <CreatePost />
                
                <figure>
                    <img src={this.state.profileImage} />
                </figure>

                <h1>{this.state.name} {this.state.surname} {this.state.nickname === '' ? '' : '(' + this.state.nickname + ')'}</h1>

                {this.state.posts}
                </>
            )}
            </>
        )
    }
}

export default MyProfilePage;