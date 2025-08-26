// SPDX-License-Identifier: UNLICENSED
// Copyright (C) 2024 Lens Labs. All Rights Reserved.
pragma solidity ^0.8.26;

interface IFeed {
    function getPostAuthor(uint256 postId) external view returns (address);
}