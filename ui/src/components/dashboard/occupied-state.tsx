import OverviewCards from "./overview/overview-cards";
import AmountInfo from "./current-amount/amount-info";
import LoanStats from "./loans/loanStats";
import RedeemCollateralModal from "./loans/loan-tables/redeem-collateral-modal";

export default function OccupiedState() {
  return (
    <>
      <AmountInfo />
      <RedeemCollateralModal />
      <LoanStats />
    </>
  );
}
