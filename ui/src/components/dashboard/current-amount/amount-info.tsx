import {
  InfoCard,
  InfoCardProps,
} from "@/components/dashboard/commons/info-card";
import AmountDisplay from "./amount-display";
import Heading from "@/components/dashboard/commons/heading";
import { useAccount, useBalance } from 'wagmi'
import { STABLE_COIN } from "@/lib/Contracts";
import { useEffect, useState } from "react";

export default function AmountInfo() {
  const { address } = useAccount()
  const [totalAssets, setTotalAssets] = useState(0);
  const result = useBalance({
    token: STABLE_COIN,
    blockTag: "latest",
    address
  })
  console.log(result)
  const calculateAmount = () => {
    if (result.data?.value) {
      return (Number(result.data?.value) / 10 ** 18)
    }else{
      return 0
    }
  }
  useEffect(() => {
    setTotalAssets(Number(calculateAmount()))
  },[result])

  const data: InfoCardProps[] = [
    {
      title: "abUSD Balance",
      type: "component",
      data: <AmountDisplay amount={totalAssets} currency="mUSDC" />,
    },
    {
      title: "Rewards",
      type: "component",
      data: <AmountDisplay amount={1045} currency="mosaic" />,
    },
  ];
  return (
    <div>
      <Heading>Current Amount</Heading>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {data.map((item, index) => (
          <InfoCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
}
