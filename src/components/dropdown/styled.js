import styled from 'styled-components';
import { Button } from 'antd';

export const StyledButton = styled(Button).attrs(({ icon }) => ({
  shape: 'round',
  icon
}))`
  text-transform: capitalize;
  font-weight: 700;
`;
