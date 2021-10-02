import styled from "styled-components";

const FormDiv = styled.div`
  color: #194351;
  padding-top: 120px;

  fieldset {
    border: none;
  }

  form {
    text-align: center;
    max-width: 50%;
    margin: 0 auto;
    background-color: lightblue;
  }

  label {
    text-align: left;
    display: block;
    margin: 1rem;
    font-size: 1rem;
  }

  input {
    border: none;
    float: right;
    font-size: 1rem;
  }

  button {
    margin: 1rem;
    background-color: lightblue;
    border: none;
    border-radius: 5px;
    border: 1px solid #194351;
  }

  .invalid {
    border: 2px solid red;
  }

  .red {
    color: red;
  }

  #message {
    text-align: center;
  }

  @media only screen and (max-width: 1200px) and (min-width: 700px) {
    form {
      max-width: 70%;
    }
  }

  @media only screen and (max-width: 600px) {
    form {
      max-width: 90%;
    }

    h1 {
      font-size: 1.5rem;
    }

    input {
      font-size: 0.8rem;
      width: 40%;
    }

    label {
      font-size: 0.8rem;
    }
  }

  @media only screen and (max-width: 300px) {
    form {
      max-width: 90%;
    }

    input {
      font-size: 0.6rem;
      width: 40%;
    }

    label {
      font-size: 0.6rem;
    }

    h1 {
      font-size: 1rem;
    }
  }
`;

export default FormDiv;