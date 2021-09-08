import styled from "styled-components";

const CreatePostDiv = styled.div`
    border: 1px solid gray;
    margin: 5rem auto;
    display: flex;
    flex-wrap: wrap;
    width: 70%;
    flex-direction: column;
    background-color: powderblue;
    border-radius: 10px;
    text-align: center;

    button {
        border-radius: 50%;
        padding: 5px 13px;
        color: #194351;
        background-color: lightblue;
        box-shadow: 0 0 .5rem gray;
        border: none;
        cursor: pointer;
        width: 4rem;
        height: 4rem;
    }

    input {
        margin: 1rem;
    }

    textarea {
        background-color: white;
        margin: .5rem 2rem;
        border-radius: 10px;
        width: 30rem;
        border-radius: 10px;
        color: black;
    }

    figure {
        margin: 1rem auto;
    }

    img {
        width: 300px;
        border: 1px solid gray;
    }

    div {
        display: flex;
        flex-direction: row;
        margin: 1rem auto;
        align-items: center;
    }
`;

export default CreatePostDiv;