import styled from "styled-components";

interface AccordionBodyProps {
  $isOpen: boolean;
}

interface AccordionSwitchProps {
  $isOpen: boolean;
}

interface AccordionItemProps {
  $isOpen: boolean;
}


export const AccordionWrapper = styled.div`
  margin-top: 70px;
  padding: 0 40px 160px 40px;
  @media (max-width: 1200px) {
    padding: 0 40px 31px 40px;
  }
  @media (max-width: 768px) {
    padding: 0 20px 31px 20px;
  }
  @media (max-width: 640px) {
    margin-top: 45px;
  }
`;

export const Title = styled.div`
  // border:2px solid red;
  width:100%;
  font-size: 30px;
  color: #cb8805;
  font-weight: 600;
  font-family: MedievalSharp;
  @media (max-width: 1200px) {
    font-size: 24px;
    letter-spacing: 0.2px;
  }
  @media (max-width: 1024px) {
    margin-bottom: 36px;
  }
  @media (max-width: 768px) {
    font-size: 26px;
    text-align: center;
  }
  @media (max-width: 640px) {
    font-size: 16px;
    text-align: center;
  }
`;

export const AccordionStyled = styled.div`
  width: 90%;
  height: 100%;
  text-align:left;
  font-family: MedievalSharp;
  
  margin: 68px auto 0;
  @media (max-width: 1024px) {
    margin: 40px auto 0;
  }
  @media (max-width: 768px) {
    margin: 35px auto 0;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const AccordionItem = styled.div<AccordionItemProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  padding: 30px;
  border: 2px solid #1a1a1a;
  border-radius: 10px;
  min-height: 76px;
  @media (max-width: 768px) {
    padding: 17px 20px;
  }
`;

export const AccordionTitle = styled.div`
  font-size: 18px;
  color: #1a1a1a;
  font-family: MedievalSharp;
  font-weight: 700;
  cursor: pointer;
  padding-right: 40px;
  @media (max-width: 1024px) {
    font-size: 16px;
  }
  @media (max-width: 768px) {
    font-size: 14px;
    font-weight: 500;
  }
`;


export const AccordionBody = styled.div<AccordionBodyProps>`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  padding-right: 60px;
  @media (max-width: 768px) {
    padding-right: 0;
  }
`;

export const AccordionText = styled.div`
  margin-top: 15px;
  color: #1a1a1a;
  font-family: MedievalSharp;
  font-size: 18px;
  line-height: 27px;
  @media (max-width: 768px) {
    font-size: 12px;
    margin-top: 11px;
    line-height: 18px;
  }
`;

export const AccordionSwitch = styled.div<AccordionSwitchProps>`
  position: absolute;
  right: 30px;
  top: 30px;
  width: 35px;
  height: 35px;
  display: flex;
  color: #cb8805;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform-origin: center;
  transition: all 0.2s;
  transform: ${({ $isOpen }) => $isOpen && "scale(1, -1)"};
  @media (max-width: 768px) {
    right: 20px;
    top: 23px;
    width: 30px;
    height: 30px;
  }
`;
