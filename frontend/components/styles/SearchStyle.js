import styled from "styled-components";

const SearchDiv = styled.div`
  text-align: center;
  padding-top: 80px;
  margin-bottom: -5rem;

  input {
    width: 100%;
    text-align: center;
    border: none;
    margin-top: .2rem;
    font-size: 1.5rem;
  }

  input:focus {
    outline: none;
  }

  li {
    list-style: none;
    margin: 1rem;
    box-shadow: 0 2px 1rem #194351;
    max-width: 95%;
    padding: 1rem;
    word-break: break-all;
    color: #194351;
    background-color: #add8e6;
  }

  li:hover,
  li:focus {
    color: #000000;
    cursor: pointer;
    background-color: #2f7d97;
  }

  @media only screen and (max-width: 450px) {
    input {
      font-size: 1rem;
    }
  }

  @media only screen and (max-width: 1100px) {
    ul {
      margin-right: 2rem;
    }
  }
`;

export default SearchDiv;