import React, { Component } from 'react';

class Like extends Component {
    like = async () => {
        try {
            const postId = this.props.postId;

            // when scrolls changes we save it in local storage, reload the page and then go again to the same scroll
            localStorage.setItem('scrollPosition', window.scrollY);
            window.location.reload();
            window.scrollTo(0, localStorage.getItem('scrollPosition'));
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/like/${postId}`, {
                method: 'PATCH',
    
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });
            await res.json();

        } catch (err) {
            console.log(err);
        };
    };

    render() {
        return <button onClick={this.like}>like</button>
    }
};

export default Like;