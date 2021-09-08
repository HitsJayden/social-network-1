import React, { Component } from 'react';

import Header from './Header';
import Like from './Like';
import Comment from './Comment';
import UpdateProfileImage from './UpdateProfileImage';
import CreatePost from './CreatePost';
import DeletePost from './DeletePost';

import PostDiv from './styles/PostStyle';
import MyProfilePageDiv from './styles/MyProfilePageStyle';

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
        try {
            this.setState({ loading: true });

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/my-profile`, {
                method: 'GET',
    
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });
    
            const resData = await res.json(); 
    
            this.setState({ name: resData.name, surname: resData.surname, nickname: resData.nickname,
                 loading: false, profileImage: resData.profileImage, posts: resData.userPosts.map(post => {
                return (
                    <PostDiv key={post._id}>
                        <DeletePost postId={post._id} />
                        <h1>Created At: {post.createdAt.slice(0, 10)} At: {post.createdAt.slice(11, 16)}</h1>
    
                        <figure>
                            <img src={post.image} alt={post.content} />
                        </figure>
                        
                        <p>{post.content}</p>
                        <p>{post.likes.likes} {post.likes.likes === 1 ? 'person' : 'people'} like this post</p>
                        <Like postId={post._id} />
                        <Comment postId={post._id} />
                    </PostDiv>
                )
            }) });
        } catch (err) {
            console.log(err);
        };
    };

    componentDidMount() {
        this.fetchData();
    };

    render() {
        return(
            <>
            <Header />

            <MyProfilePageDiv>

            {this.state.loading && <h1>Loading...</h1>}

            {!this.state.loading && (
                <>
                <h1>{this.state.name} {this.state.surname} {this.state.nickname === '' ? '' : '(' + this.state.nickname + ')'}</h1>

                {this.state.posts}

                <figure>
                    <img class="profile-img" src={this.state.profileImage} />
                </figure>

                <UpdateProfileImage />

                <CreatePost />
                </>
            )}
            </MyProfilePageDiv>
            </>
        )
    }
}

export default MyProfilePage;