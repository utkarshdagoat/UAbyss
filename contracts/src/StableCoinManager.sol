pragma solidity ^0.8.26;

import {ABUSD} from "./StableCoin.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Context} from "@openzeppelin/contracts/utils/Context.sol";

contract abUSDManager is ReentrancyGuard , Context {
    ///////////////////
    // Errors
    ///////////////////

    error BMEngine__NeedsMoreThanZero();
    error BMEngine__TokenNotAllowed(address token);
    error BMEngine__TransferFailed();
    error BMEngine__BreaksHealthFactor(uint256 healthFactorValue);
    error BMEngine__MintFailed();
    error BMEngine__HealthFactorOk();
    error BMEngine__HealthFactorNotImproved();
    error BMManager__HealthFactorBroken();

    ///////////////////
    // State Variables
    ///////////////////

    ABUSD private abUSD;

    uint256 private LIQUIDATION_THRESHOLD = 50; // This means you need to be 200% over-collateralized
    uint256 private constant LIQUIDATION_BONUS = 10; // This means you get assets at a 10% discount when liquidating
    uint256 private constant LIQUIDATION_PRECISION = 100;
    uint256 private constant MIN_HEALTH_FACTOR = 1e18;
    uint128 private constant PRICE_UBIT = 1e17;
    uint256 private constant PRECISION = 1e18;

    /// @dev Amount of collateral deposited by user
    mapping(address user => uint256 amount)
        private collateralDeposited;
    /// @dev Amount of DSC minted by user
    mapping(address user => uint256 amount) private abUSDMinted;
    uint256 private totalabUSDMinted;
    /// @dev If we know exactly how many tokens we have, we could make this immutable!
    address[] private collateralTokens;

    ///////////////////
    // Events
    ///////////////////
    event CollateralDeposited(
        address indexed user,
        uint256 indexed amount
    );
    event CollateralRedeemed(
        address indexed redeemFrom,
        address indexed redeemTo,
        uint256 amount
    );

    ///////////////////
    // Modifiers
    ///////////////////
    modifier moreThanZero(uint256 amount) {
        if (amount == 0) {
            revert BMEngine__NeedsMoreThanZero();
        }
        _;
    }

    modifier isAllowedToken(address token) {
        bool isAllowed = false;
        for (uint256 i = 0; i < collateralTokens.length; i++) {
            if (collateralTokens[i] == token) {
                isAllowed = true;
            }
        }
        if (!isAllowed) {
            revert BMEngine__TokenNotAllowed(token);
        }
        _;
    }
    constructor(address dscAddress) {
        abUSD =ABUSD(dscAddress);
    }

    function depositCollateralAndmintabUSD(
        uint256 amountCollateral,
        uint256 amountDscToMint
    ) external payable {
        require(
            msg.value == amountCollateral,
            "BMEngine__DepositAmountMismatch"
        );
        depositCollateral(amountCollateral);
        mintabUSD(amountDscToMint);
    }

    function getCollaterilaztionRatio(
        uint256 amount
    ) external view returns (uint256) {
        uint256 contribInv = totalabUSDMinted / amount;
        uint256 collateralizationRatio = 1 +
            contribInv +
            contribInv *
            contribInv;
        return collateralizationRatio;
    }

    function redeemCollateralForDsc(
        address tokenCollateralAddress,
        uint256 amountCollateral,
        uint256 amountDscToBurn
    )
        external
        moreThanZero(amountCollateral)
    {
        _burnDsc(amountDscToBurn, _msgSender(), _msgSender());
        _redeemCollateral(
            tokenCollateralAddress,
            amountCollateral,
            _msgSender(),
            _msgSender()
        );
        revertIfHealthFactorIsBroken(_msgSender());
    }

    function liquidate(
        address collateral,
        address user,
        uint256 debtToCover
    )
        external
        moreThanZero(debtToCover)
        nonReentrant
    {
        uint256 startingUserHealthFactor = _healthFactor(user);
        if (startingUserHealthFactor >= MIN_HEALTH_FACTOR) {
            revert BMEngine__HealthFactorOk();
        }
        // If covering 100  we need to $100 of collateral
        // And give them a 10% bonus
        // So we are giving the liquidator $110 of  for 100 
        // We should implement a feature to liquidate in the event the protocol is insolvent
        // And sweep extra amounts into a treasury
        uint256 bonusCollateral = (debtToCover * LIQUIDATION_BONUS) / LIQUIDATION_PRECISION;
        // Burn DSC equal to debtToCover
        // Figure out how much collateral to recover based on how much burnt
        _redeemCollateral(collateral, debtToCover + bonusCollateral, user, msg.sender);
        _burnDsc(debtToCover, user, msg.sender);

        uint256 endingUserHealthFactor = _healthFactor(user);
        // This conditional should never hit, but just in case
        if (endingUserHealthFactor <= startingUserHealthFactor) {
            revert BMEngine__HealthFactorOk();
        }
        revertIfHealthFactorIsBroken(msg.sender);
    }


    function _burnDsc(
        uint256 amountDscToBurn,
        address onBehalfOf,
        address dscFrom
    ) private {
        abUSDMinted[onBehalfOf] -= amountDscToBurn;

        bool success = abUSD.transferFrom(
            dscFrom,
            address(this),
            amountDscToBurn
        );

        // This conditional is hypothetically unreachable
        if (!success) {
            revert BMEngine__TransferFailed();
        }
        abUSD.burn(amountDscToBurn);
    }

    function _redeemCollateral(
        address tokenCollateralAddress,
        uint256 amountCollateral,
        address from,
        address to
    ) private {
        collateralDeposited[from] -= amountCollateral;
        emit CollateralRedeemed(
            from,
            to,
            amountCollateral
        );
        payable(to).transfer(amountCollateral);
    }

    function burnDsc(uint256 amount) external moreThanZero(amount) {
        _burnDsc(amount, _msgSender(), _msgSender());
        revertIfHealthFactorIsBroken(_msgSender()); // I don't think this would ever hit...
    }

    function depositCollateral(
        uint256 amountCollateral
    )
        public
        moreThanZero(amountCollateral)
        nonReentrant
    {
        collateralDeposited[_msgSender()] += amountCollateral;
        emit CollateralDeposited(
            _msgSender(),
            amountCollateral
        );
    }

    function mintabUSD(
        uint256 amountDscToMint
    ) public moreThanZero(amountDscToMint) nonReentrant {
        abUSDMinted[_msgSender()] += amountDscToMint;
        revertIfHealthFactorIsBroken(_msgSender());
        bool minted = abUSD.mint(_msgSender(), amountDscToMint);

        if (minted != true) {
            revert BMEngine__MintFailed();
        }
    }

    function revertIfHealthFactorIsBroken(address user) internal view {
        uint256 userHealthFactor = _healthFactor(user);
        if (userHealthFactor < MIN_HEALTH_FACTOR) {
            revert BMEngine__BreaksHealthFactor(userHealthFactor);
        }
    }

    function _healthFactor(address user) private view returns (uint256) {
        (
            uint256 totalDscMinted,
            uint256 collateralValueInUsd
        ) = _getAccountInformation(user);
        return _calculateHealthFactor(totalDscMinted, collateralValueInUsd);
    }

    function _getAccountInformation(
        address user
    )
        private
        view
        returns (uint256 totalDscMinted, uint256 collateralValueInUsd)
    {
        totalDscMinted = abUSDMinted[user];
        collateralValueInUsd = collateralDeposited[user];
    }


    function _getUsdValue(
        address token,
        uint256 amount
    ) private view returns (uint256) {
        return (amount * PRICE_UBIT) / PRECISION;
    }

    function _calculateHealthFactor(
        uint256 abUSDMinted,
        uint256 collateralValueInUsd
    ) internal view returns (uint256) {
        if (abUSDMinted == 0) return type(uint256).max;
        uint256 collateralAdjustedForThreshold = (collateralValueInUsd *
            LIQUIDATION_THRESHOLD) / LIQUIDATION_PRECISION;
        return (collateralAdjustedForThreshold * PRECISION) / abUSDMinted;
    }

}
