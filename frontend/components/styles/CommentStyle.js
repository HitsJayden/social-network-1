import styled from "styled-components";

const CommentDiv = styled.div`
    border: .1rem solid blue;
    background-color: blue;
    box-shadow: 0 0 1rem blue;
    border-radius: 10px;
    width: 90%;
    margin: .5rem auto;
    display: flex;
    justify-content: space-around;

    textarea {
        background-color: black;
        width: 90%;
        margin: .5rem auto;
        margin-left: .5rem;
        border-radius: 10px;
        color: white;
    }

    button {
        height: 2.5rem;
        margin: auto .5rem;
    }
`;

export default CommentDiv;