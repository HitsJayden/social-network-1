import React, { Component } from 'react';
import Header from './Header';

class CreatePost extends Component {
    state = {
        loading: false,
        content: '',
        message: null,
    };

    handleChange = e => {
        this.setState({ content: e.target.value });
    };

    fetchData = async e => {
        this.setState({ loading: true });

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/create-post`, {
            method: 'PUT',

            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },

            credentials: 'include',
            body: JSON.stringify({
                content: this.state.content,
            }),
        });

        const resData = await res.json();

        if(resData.err) {
            console.log(err);
        };

        this.setState({ laoding: false, message: resData.message });
    };

    render() {
        return(
            <>
            {this.state.message && <h1>{this.state.message}</h1>}

            <textarea onChange={this.handleChange} value={this.state.content} name="content" placeholder="What Are You Thinking?" cols="100" rows="15"></textarea>

            <button onClick={this.fetchData}>Submit</button>
            </>
        )
    }
};

export default CreatePost;