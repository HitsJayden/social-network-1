import styled from "styled-components";

const NotificationDiv = styled.div`
    margin-top: 3rem;
    right: 14rem;
    border-radius: .5rem;
    background-color: lightblue;
    color: #194351;
    position: absolute;
    border: 1px solid gray;

    h1 {
        font-size: 1rem;
        padding: .5rem;
    }

    a:hover, a:focus {
        color: black;
    }
`;

export default NotificationDiv;