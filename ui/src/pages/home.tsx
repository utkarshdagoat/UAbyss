import { ConnectButton } from "thirdweb/react";
import { createWallet, walletConnect } from "thirdweb/wallets";
import GridPattern from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils.ts";
import { useNavigate } from "react-router-dom";
import { defineChain } from "thirdweb";
import { useAccount } from "wagmi";

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  walletConnect(),
];
const myChain = defineChain({
  id: 44433,
  rpc: "https://testnet-rpc.ubitscan.io",
  testnet: true,
  nativeCurrency:{
    name:"USC",
    symbol:"USC",
    decimals:18,
  }
})


import { createThirdwebClient } from "thirdweb";
import { Button } from "@/components/ui/button";

const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB,
});

export default function Home() {
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen relative overflow-hidden flex flex-col gap-2 justify-center items-center">
      <GridPattern
        numSquares={80}
        maxOpacity={0.3}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] skew-y-12 -z-10",
          "h-[100vh] my-auto"
        )}
      />
      <h1 className="text-7xl tracking-wide font-mosaic text-primary">
        UAbyss
      </h1>
      <p className="text-muted-foreground font-semibold mb-4">
        Loop your <span className="text-primary">Ubit</span> to the Abyss... of
        Gains.
      </p>
      <ConnectButton
        client={client}
        wallets={wallets}
        theme={"dark"}
        connectButton={{
          label: "Connect Your Wallet",
        }}
        connectModal={{
          size: "wide",
          welcomeScreen: {
            title: "UAbyss",
            subtitle: "Unleash hyper-yields with decentralized looping",
          },
          showThirdwebBranding: false,
        }}
        chain={myChain}
      
      />
      {isConnected && <Button onClick={() => navigate('/dashboard')} className="mt-4">Go to Dashboard</Button>}
    </div>
  );
}
