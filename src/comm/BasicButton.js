import React from "react"
import styled from "styled-components"

const StyledButton = styled.button`
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 1rem;
  line-height: 1;
  border: 4px solid ${(props) => props.color || "gray"};
  background: ${(props) => props.background || "white"};
`;

const BasicButton = ({ name, color, background }) => {
  return (
    <StyledButton color={color} background={background}>
      {name}
    </StyledButton>
  )
};

export default BasicButton;