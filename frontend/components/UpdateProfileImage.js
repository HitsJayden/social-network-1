import React, { Component } from 'react';
import FormData from 'form-data';

import UpdateProfileImageDiv from './styles/UpdateProfileImageStyle';

class UpdateProfileImage extends Component {
    state = {
        profileImage: '',
        message: null,
        currentProfileImage: '',
        loading: false,
    };

    handleImage = async (e) => {
        try {
            const files = e.target.files;
            const formData = new FormData();
    
            // getting the first file that we find
            formData.append('file', files[0]);
    
            // appending cloudinary preset (folder where it will be saved the file)
            formData.append('upload_preset', process.env.PRESET);
    
            const res = await fetch(process.env.CLOUDINARY, {
                method: 'POST',
                body: formData,
            });
    
            const resData = await res.json();
            this.setState({ profileImage: resData.secure_url });
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
        return (
          <UpdateProfileImageDiv>
            {this.state.message && <h1>{this.state.message}</h1>}

            <form encType="multipart/form-data">
              <label htmlFor="changeImage">
                Change Image
                <input
                  onChange={this.handleImage}
                  name="changeImage"
                  type="file"
                  placeholder="Upload A Profile Image"
                  id="changeImage"
                />
              </label>

              <button onClick={this.fetchData}>
                Upload{this.state.loading ? "ing" : ""} Image!
              </button>
            </form>

            {this.state.profileImage && (
              <figure>
                <img src={this.state.profileImage} alt="profile image" />
              </figure>
            )}
          </UpdateProfileImageDiv>
        );
    }
}

export default UpdateProfileImage;