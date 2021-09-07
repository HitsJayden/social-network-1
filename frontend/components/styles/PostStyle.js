import styled from "styled-components";

const PostDiv = styled.div`
    border-bottom: 5px solid gray;
    width: 50%;
    margin: 2.5rem auto;
    text-align: center;

    img {
        width: 300px;
    }

    button {
        margin: 1rem;
    }

    .delete-post {
        border-radius: 50%;
        padding: 5px 8px;
        color: #194351;
        background-color: lightblue;
        box-shadow: 0 0 .5rem gray;
        cursor: pointer;
        border: none;
        float: right;
    }

    .delete-comment {
        border-radius: 50%;
        padding: 5px 8px;
        color: #194351;
        background-color: lightblue;
        box-shadow: 0 0 .5rem gray;
        margin: -.3rem -1rem;
        cursor: pointer;
    }
`;

export default PostDiv;