import GetLoan from "./get-loan";
import { useToast } from "@/components/ui/use-toast";
import { ConnectButton } from "thirdweb/react";
import { createWallet, walletConnect } from "thirdweb/wallets";
import { createThirdwebClient } from "thirdweb";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Landmark } from "lucide-react";

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  walletConnect(),
];

const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB,
});

export default function DashboardHeader() {
  const { toast } = useToast();
  const navigate = useNavigate();

  return (
    <div className="flex flex-row justify-between items-center">
      <h1 className="text-4xl inline-flex gap-2 text-foreground/80 font-mosaic">
        Dashboard
      </h1>
      <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate("/governance")}
          size="icon"
          className="rounded-full "
        >
          <Landmark className="w-4 h-4" />
        </Button>
        <GetLoan />
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
        />
      </div>
    </div>
  );
}
