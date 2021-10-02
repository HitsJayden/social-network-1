import React, { Component } from 'react';
import cookie from 'react-cookies';

import Header from './Header';
import Like from './Like';
import Comment from './Comment';
import SendFriendRequest from './SendFriendRequest';
import DeletePost from './DeletePost';

import MyProfilePageDiv from './styles/MyProfilePageStyle';
import PostDiv from './styles/PostStyle';
import LoadingH1 from './styles/LoadingH1';

class ProfilePage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            posts: [],
            profileImage: '',
            name: '',
            surname: '',
            nickname: '',
            message: null,
            friends: [],
            friend: false,
        };

        this.fetchData = this.fetchData.bind(this);
    }

    fetchData = async () => {
        try {
            this.setState({ loading: true })
            const userId = this.props.userId;
    
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/load-profile/${userId}`, {
                method: 'GET',
    
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
    
            const resData = await res.json(); 
            // if the user is a friend we don't show the button send friend request
            this.setState({ friends: resData.friends.map(friend => {
                const userId = cookie.load('userId');
                const userIdParams = this.props.userId;
                
                if(userId.toString() === friend.userId.toString()) {
                    return this.setState({ friend: true });
                };
    
                // if the user is the same person we redirect to profile page
                if(userId.toString() === userIdParams.toString()) {
                    return window.location.replace('/auth/my-profile')
                }
            }) })
    
            this.setState({ name: resData.name, surname: resData.surname, nickname: resData.nickname,
                 loading: false, profileImage: resData.profileImage, posts: resData.userPosts.map(post => {
                return (
                  <PostDiv key={post._id}>
                    <DeletePost postId={post._id} />
                    <h1 className="created">
                      Created At: {post.createdAt.slice(0, 10)} At: {post.createdAt.slice(11, 16)}
                    </h1>

                    {post.image && (
                      <figure>
                        <img src={post.image} alt={post.content} />
                      </figure>
                    )}

                    <p>{post.content}</p>
                    <p>
                      {post.likes.likes} {post.likes.likes === 1 ? "person" : "people"} like this post
                    </p>
                    <Like postId={post._id} />
                    <Comment postId={post._id} />
                  </PostDiv>
                );
            }) });
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

            {this.state.loading && <LoadingH1>Loading...</LoadingH1>}

            {!this.state.loading && (
              <MyProfilePageDiv>
                {this.state.posts}

                {!this.state.friend && (
                  <SendFriendRequest userId={this.props.userId} />
                )}

                <h1>
                  {this.state.name} {this.state.surname}{" "}
                  {this.state.nickname === ""
                    ? ""
                    : "(" + this.state.nickname + ")"}
                </h1>

                {this.state.message && <h1>{this.state.message}</h1>}

                <figure>
                  <img className="profile-img" src={this.state.profileImage} />
                </figure>
              </MyProfilePageDiv>
            )}
          </>
        );
    }
}

export default ProfilePage;