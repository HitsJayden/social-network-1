import styled from "styled-components";

const PostDiv = styled.div`
  border-bottom: 5px solid gray;
  width: 85%;
  margin: 2.5rem auto;
  text-align: center;
  background-color: powderblue;
  border-radius: 10px;
  margin-top: 100px;

  img {
    width: 300px;
    border: 2px solid gray;
  }

  .created {
    font-weight: 400;
    font-size: 1rem;
    padding: 1.3rem 3rem;
  }

  button {
    margin: 1rem;
    background-color: powderblue;
    border: none;
    cursor: pointer;
  }

  #like-comment {
    border: 1px solid #194351;
    border-radius: 5px;
    padding: 0.5rem;
  }

  .delete-post {
    border-radius: 50%;
    padding: 5px 8px;
    color: #194351;
    background-color: powderblue;
    box-shadow: 0 0 0.5rem gray;
    cursor: pointer;
    border: none;
    float: right;
  }

  .delete-comment {
    border-radius: 50%;
    padding: 5px 8px;
    color: #194351;
    background-color: powderblue;
    box-shadow: 0 0 0.5rem gray;
    margin: -0.2rem -1rem;
    cursor: pointer;
  }

  .delete-comment:hover,
  .delete-post:hover,
  #like-comment:hover {
    color: black;
    background-color: #2f7d97;
  }

  @media only screen and (max-width: 700px) {
    img {
      width: 200px;
    }
  }

  @media only screen and (max-width: 300px) {
    img {
      width: 150px;
    }
  }
`;

export default PostDiv;