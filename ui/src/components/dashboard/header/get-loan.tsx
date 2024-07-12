import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import { useState, useEffect } from "react";
import { HandCoins } from "lucide-react";
import { useAccount } from "wagmi";
import uibit, { ubitTestnet } from "@/lib/chain";
import {
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import { useWriteContract } from "wagmi";
import { StableCoinABI } from "@/artifacts/StableCoinManager"

import { ADDR, STABLE_MANGER } from "@/lib/Contracts";
import { useToast } from "@/components/ui/use-toast";


const EXCHANGE_RATE_API = import.meta.env.VITE_EXCHANGE_RATE_API
const dataFetch = async () => {
  const res = await axios.get(EXCHANGE_RATE_API)
  const data = await res.data
  return data
}

export default function GetLoan() {
  const switchChain = useSwitchActiveWalletChain();
  const { writeContractAsync } = useWriteContract();
  const [USDAmount, setUSDAmount] = useState(0);
  const [UBITAmount, setUbitAmount] = useState(0)
  const { address: walletAddress } = useAccount();
  const { toast } = useToast()
  const walletChain = useActiveWalletChain();
  const getLoan = async () => {

    if (walletChain?.id !== uibit.id) await switchChain(uibit);
    try {
      const hash = await writeContractAsync({
        abi: StableCoinABI,
        address: STABLE_MANGER,
        functionName: "depositCollateralAndmintabUSD",
        args: [
          ADDR,
          BigInt(Math.floor(UBITAmount * 10 ** 18)),
          BigInt(Math.floor(USDAmount* 10 ** 18)),
        ],
        value: BigInt(UBITAmount * 10 ** 18),
        chainId: ubitTestnet.id,
      });
      console.log({ hash });
      toast({ description: "Transaction submitted: " + hash });
    } catch (err) {
      console.error(err);
    }

  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      const data = await dataFetch()
      const price = data.data.price;
      if (price) {
        setUbitAmount(USDAmount / (price))
      }
    }, 750)

    return () => clearTimeout(delayDebounceFn)
  }, [USDAmount])

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button size="icon" className="rounded-full">
            <HandCoins className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Get a Loan</DialogTitle>
          </DialogHeader>
          <Label className="text-muted-foreground" htmlFor="amount" />
          <Input
            id="amount"
            name="amount"
            placeholder="Enter Loan Amount USD"
            value={USDAmount}
            onChange={(e) => setUSDAmount(Number(e.target.value))}
            type="number"
          />
          <Input
            id="amount"
            name="amount"
            placeholder="Your UBit Amount"
            value={UBITAmount}
            disabled
          />
          <p className="text-xs mt-2 text-muted-foreground">
            Select the loan type
          </p>
          <div className="flex flex-row gap-2">
            <Button variant="secondary" className="flex-1">
              Fixed
            </Button>
            <Button variant="secondary" className="flex-1">
              Dynamic
            </Button>
          </div>

          <div className="flex flex-row gap-2">
            <Input
              className="flex-1"
              placeholder="Your wallet Address"
              value={walletAddress === null ? "" : walletAddress}
            ></Input>
          </div>

          <Button onClick={getLoan}>Get Loan</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
