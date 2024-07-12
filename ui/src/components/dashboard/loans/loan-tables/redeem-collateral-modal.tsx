import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useEffect, useState } from "react";
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
import axios from "axios";
const EXCHANGE_RATE_API = import.meta.env.VITE_EXCHANGE_RATE_API
const dataFetch = async () => {
  const res = await axios.get(EXCHANGE_RATE_API)
  const data = await res.data
  return data
}


export default function RedeemCollateralModal() {
  const [repayAmount, setRepayAmount] = useState(0.0);
  const [collateralReimbursed, setCollateralReimbursed] = useState(1800);
  const switchChain = useSwitchActiveWalletChain();
  const { writeContractAsync } = useWriteContract();
  const { toast } = useToast()
  const walletChain = useActiveWalletChain();
  const redeemCollateral = async () => {

    if (walletChain?.id !== uibit.id) await switchChain(uibit);
    try {
      const hash = await writeContractAsync({
        abi: StableCoinABI,
        address: STABLE_MANGER,
        functionName: "redeemCollateralForDsc",
        args: [
          ADDR,
          BigInt(Math.floor(collateralReimbursed * 10 ** 18)),
          BigInt(Math.floor(repayAmount* 10 ** 18)),
        ],
        chainId: ubitTestnet.id,
      });
      console.log({ hash });
      toast({ description: "Transaction submitted: " + hash });
    } catch (err) {
      console.error(err);
    }

  }
  const handleSumbit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      const data = await dataFetch()
      const price = data.data.price;
      if (price) {
        setCollateralReimbursed(repayAmount/ (price))
      }
    }, 750)

    return () => clearTimeout(delayDebounceFn)
  }, [repayAmount])
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"outline"}>Redeem</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Redeem Collateral</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSumbit}>
          <div>
            <Label>Amount $</Label>
            <Input
              placeholder="Repayment amount (in USD)"
              onChange={(e) => setRepayAmount(parseFloat(e.target.value))}
            />
          </div>
          <div className="bg-muted/40 border py-3 px-4 rounded-md flex justify-between">
            <h1 className="text-sm text-muted-foreground font-semibold">
              Collateral Reimbursed
            </h1>
            <div className="text-foreground inline-flex items-center gap-2 text-sm font-semibold">
              {collateralReimbursed} UBIT
            </div>
          </div>
          <Button  onClick={redeemCollateral}>Redeem</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
