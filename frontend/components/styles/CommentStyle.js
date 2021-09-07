import styled from "styled-components";

const CommentDiv = styled.div`
    border: .1rem solid gray;
    background-color: powderblue;
    border-radius: 10px;
    width: 90%;
    margin: 1rem auto;
    display: flex;
    justify-content: space-around;

    textarea {
        background-color: white;
        width: 90%;
        margin: .5rem auto;
        margin-left: .5rem;
        border-radius: 10px;
        color: black;
    }

    button {
        border-radius: 50%;
        padding: 5px 13px;
        color: #194351;
        background-color: lightblue;
        box-shadow: 0 0 .5rem gray;
        border: none;
        cursor: pointer;
    }
`;

export default CommentDiv;