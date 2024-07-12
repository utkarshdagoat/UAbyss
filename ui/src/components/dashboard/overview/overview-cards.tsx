import {
  InfoCardProps,
  InfoCard,
} from "@/components/dashboard/commons/info-card";
import { useEffect, useState } from "react";
import Heading from "@/components/dashboard/commons/heading";
import { useAccount, useBalance } from "wagmi";
import { NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { STABLE_COIN } from "@/lib/Contracts";
import axios from "axios";
const EXCHANGE_RATE_API = import.meta.env.VITE_EXCHANGE_RATE_API
const dataFetch = async () => {
  const res = await axios.get(EXCHANGE_RATE_API)
  const data = await res.data
  return data
}
export default function OverviewCards() {
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalRepayments, setTotalRepayments] = useState("1045");
  const [creditScore, setCreditScore] = useState("470");
  const { address } = useAccount();
  const result1 = useBalance({
    token: STABLE_COIN,
    blockTag: "latest",
    address
  })
  const result2 = useBalance({
    blockTag: "latest",
    address
  })
  const TotalAssets = async () => {
    if (result1.data?.value && result2.data?.value) {
      const data = await dataFetch()
      const price = data.data.price;
      let value = (Number(result1.data.value) / 10 ** 18) + (Number(result2.data?.value) / 10 ** 18)
      console.log(value)
      setTotalAssets(value)
    }
    setTotalAssets(0)
  }
  useEffect(() => {
    TotalAssets()
    console.log(totalAssets)
  }, [result1, result2]);


  const data: InfoCardProps[] = [
    {
      title: "Total Assets",
      type: "value",
      unit: "$",
      data: totalAssets,
    },
    {
      title: "Total Repayments",
      type: "value",
      unit: "$",
      data: 0,
    }
  ];

  return (
    <div>
      <Heading>Overview</Heading>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {data.map((item, index) => (
          <InfoCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
}
