import React from "react";
import styled from "styled-components";

const Footer = styled.footer`
  background-color: white;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px -1px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 0;
  width: 100%;
  font-size: 14px;
  color: #333;
`;

const FooterText = styled.p`
  margin: 0;
  font-family: Arial, sans-serif;
`;
const FooterComponent = () => {
  return (
    <Footer>
      <FooterText>© 2025 Your Company. All rights reserved.</FooterText>
    </Footer>
  );
};

export default FooterComponent;
