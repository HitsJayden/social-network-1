import styled from "styled-components";

const MyProfilePageDiv = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  padding-top: 70px;

  .profile-img {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    object-fit: cover;
    margin: 1rem;
  }

  #message {
    color: #194351;
    padding-top: 150px;
  }

  h1 {
    margin: 1rem;
  }

  button {
    cursor: pointer;
    background-color: #add8e6;
    color: #194351;
    border: none;
    border-radius: 50%;
    padding: 5px 8px;
    box-shadow: 0 0 0.3rem #808080;
    margin: 1rem;
  }

  button:hover {
    color: black;
    background-color: #2f7d97;
  }

  @media only screen and (max-width: 300px) {
    .profile-img {
      width: 150px;
      height: 150px;
    }
  }
`;

export default MyProfilePageDiv;