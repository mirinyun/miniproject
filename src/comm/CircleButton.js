import React from "react"
import styled from "styled-components"

const StyledButton = styled.button`
  font-size: 1.5rem;
  height: 300px;
  width: 300px;
  border-radius: 50%;
  border: 4px solid ${(props) => props.color || "gray"};
  background: ${(props) => props.background || "white"};
`;

const CircleButton = ({ name, color, background }) => {
  return (
    <StyledButton color={color} background={background}>
      {name}
    </StyledButton>
  )
};

export default CircleButton;