import styled from 'styled-components';
import Colors from './Colors';

const Button = styled.button`
  background: ${Colors.BUTTON_BACKGROUND};
  border-radius: 5px;
  border: 1px solid ${Colors.BORDER};
  box-sizing: border-box;
  color: ${Colors.TEXT};
  cursor: pointer;
  font-weight: lighter;
  line-height: 28px;
  padding: 0 12px;
  white-space: nowrap;

  &:hover {
    background-color: ${Colors.BUTTON_HOVER_BACKGROUND};
  }
`;

export default Button;
