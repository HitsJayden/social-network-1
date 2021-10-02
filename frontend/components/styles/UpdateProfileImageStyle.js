import styled from "styled-components";

const UpdateProfileImageDiv = styled.div`
  img {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    object-fit: cover;
  }

  label {
    cursor: pointer;
    background-color: lightblue;
    color: #194351;
    border: none;
    border-radius: 50%;
    padding: 5px 8px;
    box-shadow: 0 0 0.3rem gray;
    margin: 1rem;
    font-size: 0.8rem;
  }

  label:hover {
    color: black;
    background-color: #2f7d97;
  }

  input[type="file"] {
    display: none;
  }
`;

export default UpdateProfileImageDiv;