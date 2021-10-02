import styled from "styled-components";

const NavDiv = styled.div`
  background-color: #add8e6;
  padding: 1rem;
  position: fixed;
  width: 100%;
  display: flex;
  justify-content: space-between;

  button {
    padding: 0.5rem;
    cursor: pointer;
    background-color: #add8e6;
    color: #194351;
    border: none;
    border-radius: 50%;
    padding: 5px 8px;
    box-shadow: 0 0 0.3rem gray;
  }

  button:hover {
    color: #000000;
    background-color: #2f7d97;
  }
`;

export default NavDiv;