import React, { Component } from "react";

import Like from "./Like";
import Comment from "./Comment";
import Header from "./Header";

import PostDiv from "./styles/PostStyle";
import DeletePost from "./DeletePost";
import LoadingH1 from "./styles/LoadingH1";

class ViewPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      content: "",
      image: undefined,
      likes: 0,
      createdAt: "",
    };

    this.fetchData = this.fetchData.bind(this);
  }

  fetchData = async () => {
    try {
      this.setState({ loading: true });
      const postId = this.props.postId;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/view-post/${postId}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        }
      );

      const resData = await res.json();
      this.setState({
        loading: false,
        content: resData.content,
        likes: resData.likes,
        image: resData.image,
        createdAt: resData.createdAt,
      });
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
          <PostDiv key={this.props.postId}>
            <DeletePost postId={this.props.postId} />
            <h1 className="created">
              Created At: {this.state.createdAt.slice(0, 10)} At:{" "}
              {this.state.createdAt.slice(11, 16)}
            </h1>

            {this.state.image && (
              <figure>
                <img src={this.state.image} alt={this.state.content} />
              </figure>
            )}

            <p>{this.state.content}</p>
            <p>
              {this.state.likes} {this.state.likes === 1 ? "person" : "people"}{" "}
              like this post
            </p>
            <Like postId={this.props.postId} />
            <Comment postId={this.props.postId} />
          </PostDiv>
        )}
      </>
    );
  }
}

export default ViewPost;
