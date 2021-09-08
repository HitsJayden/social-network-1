import styled from "styled-components";

const UpdateProfileImageDiv = styled.div`
    img {
        width: 300px;
        height: 300px;
        border-radius: 50%;
        object-fit: cover;
    }

    label {
        margin: 1rem;
    }

    button {
        padding: .5rem;
        cursor: pointer;
        background-color: lightblue;
        color: #194351;
        border: none;   
        border-radius: 50%;
        padding: 5px 8px;
        box-shadow: 0 0 .3rem gray;
        margin: 1rem;
    }

    button:hover {
        color: black;
        background-color: #2F7D97;
    }
`;

export default UpdateProfileImageDiv;