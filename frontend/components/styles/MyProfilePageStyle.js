import styled from "styled-components";

const MyProfilePageDiv = styled.div`
    padding-top: 70px;
    display: flex;
    flex-direction: column-reverse;

    .profile-img {
        width: 300px;
        height: 300px;
        border-radius: 50%;
        object-fit: cover;
        background-position: center;
    }

    h1 {
        margin: 1rem;
    }
`;

export default MyProfilePageDiv;