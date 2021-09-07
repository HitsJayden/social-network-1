import React, { Component } from 'react';
import FormData from 'form-data';

import CreatePostDiv from './styles/CreatePostStyle';

class CreatePost extends Component {
    state = {
        loading: false,
        content: '',
        message: null,
        image: null,
    };

    handleChange = e => {
        this.setState({ content: e.target.value });
    };

    handleImage = async () => {
        try {
            const imageFile = document.getElementById('image');
            const files = imageFile.files;
            const formData = new FormData;
    
            // getting the first file that we find
            formData.append('file', files[0]);
    
            // appending cloudinary preset (folder where it will be saved the file)
            formData.append('upload_preset', process.env.PRESET);
    
            const res = await fetch(process.env.CLOUDINARY, {
                method: 'POST',
                body: formData,
            });
    
            const resData = await res.json();
            this.setState({ image: resData.secure_url });
        } catch (err) {
            console.log(err);
        };
    };

    fetchData = async e => {
        try {
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
                    image: this.state.image,
                }),
            });
    
            const resData = await res.json();
            this.setState({ laoding: false, message: resData.message });

            // when scrolls changes we save it in local storage, reload the page and then go again to the same scroll
            localStorage.setItem('scrollPosition', window.scrollY);
            window.location.reload();
            window.scrollTo(0, localStorage.getItem('scrollPosition'));
        } catch (err) {
            console.log(err);
        };
    };

    render() {
        return(
            <CreatePostDiv>
                {this.state.message && <h1>{this.state.message}</h1>}

                <label htmlFor="image">
                    Image

                    <input
                        name="image"
                        id="image"
                        onChange={this.handleImage}
                        placeholder="Upload An Image"
                        type="file"
                    />
                </label>

                {this.state.image && (
                    <figure>
                        <img src={this.state.image} alt={this.state.content} />
                    </figure>
                )}

                <textarea onChange={this.handleChange} value={this.state.content} name="content" placeholder="What Are You Thinking?" cols="100" rows="15"></textarea>

                <button onClick={this.fetchData}>Submit</button>
            </CreatePostDiv>
        )
    }
};

export default CreatePost;