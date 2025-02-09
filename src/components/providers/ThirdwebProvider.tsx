import { FC, PropsWithChildren } from "react";
import { ThirdwebProvider as Provider } from "thirdweb/react";

const ThirdwebProvider: FC<PropsWithChildren> = ({ children }) => {
  return <Provider>{children}</Provider>;
};

export default ThirdwebProvider;
