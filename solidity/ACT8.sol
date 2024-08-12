// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract AdvancedTokenWithVesting is ERC20, Ownable, Pausable, ERC20Burnable {
    struct VestingSchedule {
        uint256 totalAmount;
        uint256 releasedAmount;
        uint256 vestingStart;
        uint256 vestingCliff;
        uint256 vestingDuration;
    }

    mapping(address => VestingSchedule) private _vestingSchedules;
    uint256 private immutable _initialSupply = 1000000 * 10 ** 18;

    event TokensReleased(address indexed beneficiary, uint256 amount);
    event VestingAdded(address indexed beneficiary, uint256 amount, uint256 start, uint256 cliff, uint256 duration);

    constructor() ERC20("Advanced Token", "ADT") {
        _mint(msg.sender, _initialSupply);
    }

    function addVesting(
        address beneficiary,
        uint256 totalAmount,
        uint256 vestingStart,
        uint256 vestingCliff,
        uint256 vestingDuration
    ) external onlyOwner {
        require(_vestingSchedules[beneficiary].totalAmount == 0, "Vesting already exists for this address");
        require(beneficiary != address(0), "Beneficiary is the zero address");
        require(totalAmount > 0, "Total amount must be greater than 0");
        require(vestingCliff <= vestingDuration, "Cliff is longer than duration");

        _vestingSchedules[beneficiary] = VestingSchedule({
            totalAmount: totalAmount,
            releasedAmount: 0,
            vestingStart: vestingStart,
            vestingCliff: vestingStart + vestingCliff,
            vestingDuration: vestingDuration
        });

        emit VestingAdded(beneficiary, totalAmount, vestingStart, vestingCliff, vestingDuration);
    }

    function releaseTokens(address beneficiary) external {
        VestingSchedule storage schedule = _vestingSchedules[beneficiary];
        require(schedule.totalAmount > 0, "No vesting schedule found for this address");
        require(block.timestamp >= schedule.vestingCliff, "Vesting cliff has not passed");

        uint256 unreleased = _releasableAmount(schedule);
        require(unreleased > 0, "No tokens are due");

        schedule.releasedAmount += unreleased;
        _transfer(owner(), beneficiary, unreleased);

        emit TokensReleased(beneficiary, unreleased);
    }

    function _releasableAmount(VestingSchedule storage schedule) internal view returns (uint256) {
        return _vestedAmount(schedule) - schedule.releasedAmount;
    }

    function _vestedAmount(VestingSchedule storage schedule) internal view returns (uint256) {
        if (block.timestamp >= schedule.vestingStart + schedule.vestingDuration) {
            return schedule.totalAmount;
        } else {
            uint256 elapsedTime = block.timestamp - schedule.vestingStart;
            return (schedule.totalAmount * elapsedTime) / schedule.vestingDuration;
        }
    }

    function burn(uint256 amount) public override onlyOwner {
        _burn(msg.sender, amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function transfer(address to, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transfer(to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transferFrom(from, to, amount);
    }

    function getVestingSchedule(address beneficiary) external view returns (VestingSchedule memory) {
        return _vestingSchedules[beneficiary];
    }
}
