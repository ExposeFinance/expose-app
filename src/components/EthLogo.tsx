import ethIcon from "cryptocurrency-icons/svg/color/eth.svg";

const EthLogo = ({
  size = 48,
  className = "",
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <img
      src={ethIcon}
      alt="Ethereum Logo"
      width={size}
      height={size}
      className={className}
    />
  );
};

export default EthLogo;
