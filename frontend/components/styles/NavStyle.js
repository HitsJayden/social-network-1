import styled from "styled-components";

const NavDiv = styled.div`
    background-color: lightblue;
    padding: 1rem;
    position: fixed;
    width: 100%;
    display: flex;
    justify-content: space-between;

    button {
        padding: .5rem;
        cursor: pointer;
        background-color: lightblue;
        color: #194351;
        border: none;   
        border-radius: 50%;
        padding: 5px 8px;
        box-shadow: 0 0 .3rem gray;
    }
`;

export default NavDiv;