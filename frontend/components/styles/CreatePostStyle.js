import styled from "styled-components";

const CreatePostDiv = styled.div`
  margin: 1rem auto;
  display: flex;
  flex-wrap: wrap;
  width: 85%;
  flex-direction: column;
  background-color: powderblue;
  border-radius: 10px;
  text-align: center;
  border-bottom: 5px solid gray;

  button {
    border-radius: 50%;
    padding: 5px 13px;
    color: #194351;
    background-color: lightblue;
    box-shadow: 0 0 0.5rem gray;
    border: none;
    cursor: pointer;
    width: 4rem;
    height: 4rem;
  }

  button:hover,
  label:hover {
    color: black;
    background-color: #2f7d97;
  }

  label {
    cursor: pointer;
    background-color: lightblue;
    color: #194351;
    border: none;
    border-radius: 50%;
    padding: 1rem;
    box-shadow: 0 0 0.3rem gray;
    margin: 1rem auto;
    font-size: 0.8rem;
    width: 8rem;
  }

  input[type="file"] {
    display: none;
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
    width: 200px;
    border: 1px solid gray;
  }

  form {
    margin: .5rem;
    margin-top: 1.5rem;
  }

  div {
    display: flex;
    flex-direction: row;
    margin: 1rem auto;
    align-items: center;
  }

  @media only screen and (max-width: 700px) {
    textarea {
      width: 10rem;
    }
  }

  @media only screen and (max-width: 330px) {
    img {
      width: 100px;
    }


    textarea {
      width: 8rem;
      margin: .5rem;
    }
  }
`;

export default CreatePostDiv;