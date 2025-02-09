import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Skeleton } from "@/components/ui/skeleton";
import { CircleDollarSign, ShieldCheck } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { sepolia } from "thirdweb/chains";
import { client } from "@/thirdweb/thirdwebClient";
import {
  ConnectButton,
  useActiveAccount,
  useWalletBalance,
} from "thirdweb/react";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function Home() {
  const userProfile = useUserProfile();
  const activeAccount = useActiveAccount();
  const walletAddress = activeAccount?.address;
  const { data, isLoading, isError } = useWalletBalance({
    chain: sepolia,
    address: walletAddress,
    client,
  });

  const walletData = [
    {
      id: 1,
      name: "ETH",
      amount: `${data?.displayValue}`,
      icon: <CircleDollarSign className="text-yellow-1000" />,
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
              Introducing Expose Wallet
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl flex justify-center">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <p className="text-sm">
              Swap, send, borrow and lend crypto with just your voice!
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
            <ConnectButton client={client}></ConnectButton>
          </>
        </div>

        {/* Wallet Section */}
        <div className="space-y-4" data-aos="fade-in">
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
