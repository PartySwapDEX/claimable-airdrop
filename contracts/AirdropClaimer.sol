//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "yay-token/contracts/PartyToken.sol";

contract AirdropClaimer is Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    PartyToken public party;
    EnumerableSet.AddressSet private whitelisted;
    EnumerableSet.AddressSet private blacklisted;
    uint256 private amountPerAddress;

    constructor(PartyToken _party, uint256 _amountPerAddress) {
        party = _party;
        amountPerAddress = _amountPerAddress;
    }

    function isWhitelisted(address toCheck) public view returns (bool) {
        return whitelisted.contains(toCheck);
    }

    function isBlacklisted(address toCheck) public view returns (bool) {
        return blacklisted.contains(toCheck);
    }

    function getAmountPerAddress() public view returns (uint256) {
        return amountPerAddress;
    }

    function setAmountPerAddress(uint256 _amountPerAddress) public onlyOwner {
        amountPerAddress = _amountPerAddress;
    }

    // Try to claim
    function claim() public {
        require(isWhitelisted(msg.sender), "ERROR: You are not whitelisted");
        require(
            isBlacklisted(msg.sender) == false,
            "ERROR: You are blacklisted"
        );
        party.transfer(msg.sender, amountPerAddress);
        _blacklistSelf();
    }

    function whitelist(address toWhitelist) public onlyOwner {
        require(
            whitelisted.contains(toWhitelist) == false,
            "ERROR: Address is already whitelisted"
        );
        whitelisted.add(toWhitelist);

        if (blacklisted.contains(toWhitelist)) blacklisted.remove(toWhitelist);
    }

    function blacklist(address toBlacklist) public onlyOwner {
        require(
            blacklisted.contains(toBlacklist) == false,
            "ERROR: Address is already blacklisted"
        );
        blacklisted.add(toBlacklist);

        if (whitelisted.contains(toBlacklist)) whitelisted.remove(toBlacklist);
    }

    function _blacklistSelf() private {
        if (blacklisted.contains(msg.sender) == false)
            blacklisted.add(msg.sender);
        if (whitelisted.contains(msg.sender)) whitelisted.remove(msg.sender);
    }
}
