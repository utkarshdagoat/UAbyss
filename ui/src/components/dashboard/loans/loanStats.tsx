import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "January", amountLocked: 186, tokensMinted: 80 },
  { month: "February", amountLocked: 305, tokensMinted: 200 },
  { month: "March", amountLocked: 237, tokensMinted: 120 },
  { month: "April", amountLocked: 73, tokensMinted: 190 },
  { month: "May", amountLocked: 209, tokensMinted: 130 },
  { month: "June", amountLocked: 214, tokensMinted: 140 },
];

const chartConfig = {
  amountLocked: {
    label: "Amount locked",
    color: "hsl(var(--chart-1))",
  },
  tokensMinted: {
    label: "Tokens minted",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function LoanStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
        <CardDescription>
          Showing tokens minted and amount locked for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillAmountLocked" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-amountLocked)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-amountLocked)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillTokensMinted" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-tokensMinted)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-tokensMinted)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="tokensMinted"
              type="natural"
              fill="url(#fillTokensMinted)"
              fillOpacity={0.4}
              stroke="var(--color-tokensMinted)"
              stackId="a"
            />
            <Area
              dataKey="amountLocked"
              type="natural"
              fill="url(#fillAmountLocked)"
              fillOpacity={0.4}
              stroke="var(--color-amountLocked)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
