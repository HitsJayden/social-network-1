import styled from "styled-components";

const LoadCommentsDiv = styled.div`
    border: .1rem solid gray;
    background-color: powderblue;
    border-radius: 10px;
    width: 90%;
    margin: 1rem auto;
    display: block;
    text-align: left;
    line-height: .2rem;

    p {
        margin: 1rem;
    }

    button {
        float: right;
        margin-right: 1rem;
        border: none;
    }

    .message {
        font-size: 1rem;
        margin: 1rem;
        text-align: center;
    }
`;

export default LoadCommentsDiv;