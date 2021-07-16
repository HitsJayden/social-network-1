import React, { Component } from 'react';
import FormData from 'form-data';

class UpdateProfileImage extends Component {
    state = {
        profileImage: '',
        message: null,
        currentProfileImage: '',
        loading: false,
    };

    handleImage = async () => {
        try {
            const imageFile = document.getElementById('image');
            const files = imageFile.files;
            const formData = new FormData();
    
            // getting first file that we find
            formData.append('file', files[0]);
    
            // appending cloudinary preset (folder where it will be stored the file)
            formData.append('upload_preset', process.env.PRESET);
    
            const res = await fetch(process.env.CLOUDINARY, {
                method: 'POST',
                body: formData,
            });
    
            const resData = await res.json();
            this.setState({ profileImage: resData.secure_url, loading: false });
        } catch (err) {
            console.log(err);
        };
    };

    fetchData = async () => {
        try {
            this.setState({ loading: true });

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/load-profile-image`, {
                method: 'PATCH',
    
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    changeImage: this.state.profileImage,
                })
            });
    
            const resData = await res.json();
            this.setState({ message: resData.message, loading: false, });
        } catch (err) {
            console.log(err);
        };
    };

    render() {
        return(
            <div>
                {this.state.message && <h1>{this.state.message}</h1>}

                <label htmlFor="changeImage">
                    Change Image

                    <input
                        onChange={this.handleImage}
                        name="changeImage"
                        type="file"
                        placeholder="Upload An Image"
                        id="image"
                    />
                </label>

                {this.state.profileImage && (
                    <figure>
                        <img src={this.state.profileImage} alt="profile image" />
                    </figure>
                )}

                <button onClick={this.fetchData}>Upload{this.state.loading ? 'ing' : ''} Image!</button>
            </div>
        )
    }
}

export default UpdateProfileImage;