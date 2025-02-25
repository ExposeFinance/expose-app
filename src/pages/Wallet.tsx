import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Skeleton } from "@/components/ui/skeleton";
import { WalletIcon } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { sepolia } from "thirdweb/chains";
import { client } from "@/thirdweb/thirdwebClient";
import {
  ConnectButton,
  useActiveAccount,
  useWalletBalance,
} from "thirdweb/react";
import { useUserProfile } from "@/hooks/useUserProfile";
import EthLogo from "@/components/EthLogo";

export default function Home() {
  const userProfile = useUserProfile();
  const activeAccount = useActiveAccount();
  const walletAddress = activeAccount?.address;
  const { data } = useWalletBalance({
    chain: sepolia,
    address: walletAddress,
    client,
  });

  const walletData = [
    {
      id: 1,
      name: "ETH",
      amount: `${data?.displayValue}`,
      icon: <EthLogo size={35} />,
    },
  ];

  return (
    <PageLayout title="Wallet">
      <div className="flex flex-col h-full space-y-4">
        {/* Card Section */}
        <Card
          className="bg-surface-primary border-none shadow-none"
          data-aos="fade-in"
        >
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold">
              Your New Super-Agent Wallet
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4 text-sm md:text-base">
            <div className="text-4xl flex justify-center">
              <WalletIcon className="w-10 h-10" />
            </div>
            <p>
              Featuring a <strong>gasless</strong> and <strong>signless</strong>{" "}
              UX, access to <strong>2500+ EVM chains</strong>, and{" "}
              <strong>crosschain transactions</strong>.
            </p>
          </CardContent>
        </Card>

        {/* Profile Section */}
        <div
          className="flex flex-col items-center space-y-4"
          data-aos="fade-in"
        >
          <>
            <Avatar className="w-24 h-24">
              <AvatarImage src={userProfile.profileImage} alt="dummy user" />
              <AvatarFallback className="bg-primary text-[theme(colors.text.primary)]">
                {userProfile.name}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold text-[theme(colors.text.primary)]">
              {userProfile.name}
            </h2>
            <ConnectButton
              detailsButton={{
                style: {
                  borderRadius: "20px",
                },
              }}
              client={client}
            ></ConnectButton>
          </>
        </div>

        {/* Wallet Section */}
        <div className="space-y-4" data-aos="fade-in">
          <h2 className="text-lg font-semibold">Balances</h2>
          {walletData.map((item) => (
            <Card
              key={item.id}
              className="flex items-center space-x-2 py-1 border-none shadow-none"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-[theme(colors.text.secondary)] text-sm">
                  {item.amount}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
