import styled from "styled-components";

const NotificationDiv = styled.div`
  margin-top: 3rem;
  right: 14rem;
  border-radius: 0.5rem;
  background-color: lightblue;
  color: #194351;
  position: absolute;
  border: 1px solid gray;

  h1 {
    font-size: 1rem;
    padding: 0.5rem;
  }

  button {
    margin-left: 3.2rem;
    margin-bottom: 0.5rem;
  }

  a:hover,
  a:focus {
    color: black;
  }

  @media only screen and (max-width: 1200px) {
    right: 10rem;
  }

  @media only screen and (max-width: 1000px) {
    right: 7rem;

    h1 {
        font-size: .8rem;
    }
  }

  @media only screen and (max-width: 550px) {
    right: 5rem;
  }

  @media only screen and (max-width: 450px) {
    right: 1rem;
    width: 50%;
    display: flex;
    flex-direction: column;

    button {
        margin: .5rem auto;
    }
  }
`;

export default NotificationDiv;