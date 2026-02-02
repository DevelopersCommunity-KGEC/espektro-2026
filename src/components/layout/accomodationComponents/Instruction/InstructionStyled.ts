import styled from 'styled-components';

export const InstructionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem auto;
  max-width: 1200px;
  padding: 0 1rem;
`;

export const Title = styled.h2`
  font-family: 'MedievalSharp', serif;
  font-size: 2.5rem;
  color: #cb8805;
  margin-bottom: 1.5rem;
  text-align: center;
`;

export const Text = styled.p`
  font-family: 'MedievalSharp', serif;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  color: #1a1a1a;
  position: relative;
  padding-left: 1.5rem;
  
  &:before {
    content: '•';
    position: absolute;
    left: 0;
    color: #cb8805;
  }
`;

export const Col = styled.div`
  width: 100%;
  max-width: 800px;
`;
