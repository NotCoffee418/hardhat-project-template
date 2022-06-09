//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ExampleContract is Ownable {
    function doSomething(address parameter)
        external
        view
        onlyOwner
        returns (address)
    {
        return parameter;
    }
}
