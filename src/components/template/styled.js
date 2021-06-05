import styled from 'styled-components';

export const TemplateInfoTitle = styled.div`
  text-align: center;
`;

export const TemplateInfoItem = styled(TemplateInfoTitle)`
  border: 1px solid ${({ theme }) => theme.colors.color2};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 16px;
`;

export const Container = styled.div`
  margin: 0 auto;
  max-width: 800px;
`;
