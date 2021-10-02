import React, { Component } from 'react';
import cookie from 'react-cookies';
import Link from 'next/link';

import CreatePost from './CreatePost';
import Comment from './Comment';
import Header from './Header';
import Like from './Like';

import HomePageDiv from './styles/HomePageStyle';
import PostDiv from './styles/PostStyle';

class HomePage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            posts: [],
            content: '',
        };

        this.fetchData = this.fetchData.bind(this);
    }

    fetchData = async () => {
        try {
            this.setState({ loading: true });

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/home-page`, {
                method: 'GET',
    
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
    
                credentials: 'include',
            });
            const resData = await res.json();
    
            this.setState({ loading: false, posts: resData.posts.map(post => { 
                return(
                    <PostDiv key={post._id}>
                        <h1 className="created">Created At: {post.createdAt.slice(0, 10)} At: {post.createdAt.slice(11, 16)}</h1>
    
                        {post.image && (
                            <figure>
                                <img src={post.image} alt={post.content} />
                            </figure>
                        )}
                        
                        <Link href={`/auth/view-post/${post._id}`}><p>{post.content}</p></Link>
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
        if(cookie.load('authCookie')) {
            this.fetchData();
        };
    };

    render() {
        return(
            <>
            <Header />

            <HomePageDiv>

                {this.state.loading && <h1>Loading...</h1>}

                {cookie.load('authCookie') && !this.state.loading && <CreatePost />}

                {cookie.load('authCookie') && !this.state.loading && this.state.posts}

                {!cookie.load('authCookie') && <h1 id="message">You Need To Login In Order To See This Page</h1>}

            </HomePageDiv>
            </>
        );
    };
};

export default HomePage;