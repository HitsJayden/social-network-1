import styled from "styled-components";

const NavDiv = styled.div`
    background-color: blue;
    padding: 1rem;
    position: fixed;
    width: 100%;
    display: flex;
    justify-content: space-between;

    button {
        padding: .5rem;
        cursor: pointer;
        background-color: white;
        border: none;   
    }
`;

export default NavDiv;