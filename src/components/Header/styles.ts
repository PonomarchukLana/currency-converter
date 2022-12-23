import styled from "styled-components";

export const HeaderWrapper = styled.header`
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eeeeee;
`;

export const Logo = styled.h1`
  color: #bdbdbd;
  font-weight: 200;
  text-transform: lowercase;
  cursor: pointer;
`;

export const CurrencyWrapper = styled.div`
  display: flex;
  color: #bdbdbd;
  font-size: 11px;

  & span {
    margin-left: 21px;
  }

  & p {
    margin: 3px;
  }
`;
