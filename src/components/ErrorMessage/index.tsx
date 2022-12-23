import React from "react";
import { HeaderWrapper } from "./styles";

const ErrorMessage = ({helperMessage}) => {
  return <HeaderWrapper>{helperMessage}</HeaderWrapper>;
};

export default ErrorMessage;
