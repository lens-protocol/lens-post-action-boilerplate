// SPDX-License-Identifier: UNLICENSED
// Copyright (C) 2024 Lens Labs. All Rights Reserved.
pragma solidity ^0.8.26;

import {KeyValue} from "contracts/core/types/Types.sol";
import {Errors} from "contracts/core/types/Errors.sol";
import {IFeed} from "contracts/core/interfaces/IFeed.sol";

interface IPostAction {
    function configure(address originalMsgSender, address feed, uint256 postId, KeyValue[] calldata params)
        external
        payable
        returns (bytes memory);

    function execute(address originalMsgSender, address feed, uint256 postId, KeyValue[] calldata params)
        external
        payable
        returns (bytes memory);

    function setDisabled(
        address originalMsgSender,
        address feed,
        uint256 postId,
        bool isDisabled,
        KeyValue[] calldata params
    ) external payable returns (bytes memory);
}