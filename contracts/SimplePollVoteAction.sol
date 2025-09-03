// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IPostAction} from "contracts/extensions/actions/ActionHub.sol";
import {KeyValue} from "contracts/core/types/Types.sol";
import {OwnableMetadataBasedPostAction} from "contracts/actions/post/base/OwnableMetadataBasedPostAction.sol";
import {IFeed} from "contracts/core/interfaces/IFeed.sol";

/**
 * @title SimplePollVoteAction
 * @notice A simple post action allowing users to cast a boolean vote (e.g., Yes/No) on a post.
 *         Prevents double voting.
 */
contract SimplePollVoteAction is OwnableMetadataBasedPostAction {
    event PollVoted(address indexed voter, uint256 indexed postId, bool vote);

    // feed => postId => voter => hasVoted
    mapping(address => mapping(uint256 => mapping(address => bool)))
        private _hasVoted;

    // feed => postId => vote => count
    mapping(address => mapping(uint256 => mapping(bool => uint256)))
        private _voteCounts;

    constructor(
        address actionHub,
        address owner,
        string memory metadataURI
    ) OwnableMetadataBasedPostAction(actionHub, owner, metadataURI) {}

    /**
     * @notice Configures the SimplePollVote Action for a given post.
     * @param originalMsgSender The address initiating the configuration via the ActionHub. Must be post author.
     * @param feed The address of the feed contract where the post exists.
     * @param postId The ID of the post being configured.
     * @param params Not used
     * @return bytes Empty bytes.
     */
    function _configure(
        address originalMsgSender,
        address feed,
        uint256 postId,
        KeyValue[] calldata params
    ) internal view override returns (bytes memory) {
        require(
            originalMsgSender == IFeed(feed).getPostAuthor(postId),
            "Only author can configure"
        );
        // Any extra configuration logic could be added here (e.g. mapping each possible vote type to some string)
        // Emitting an event Lens_ActionHub_PostAction_Configured happens automatically via ActionHub
        return "";
    }

    /**
     * @notice Executes a vote on a given post.
     * @param originalMsgSender The address initiating the vote via the ActionHub.
     * @param feed The address of the feed contract where the post exists.
     * @param postId The ID of the post being voted on.
     * @param params Array of key-value pairs. Expected to contain at least one element,
     *        where the `value` of the first element is the ABI-encoded boolean vote.
     * @return bytes Empty bytes.
     * Requirements:
     * - The `originalMsgSender` must not have voted on this `postId` before.
     * - `params` must not be empty and the first element's value must be abi-decodable as a boolean.
     */
    function _execute(
        address originalMsgSender,
        address feed,
        uint256 postId,
        KeyValue[] calldata params
    ) internal override returns (bytes memory) {
        require(!_hasVoted[feed][postId][originalMsgSender], "Already voted");

        _hasVoted[feed][postId][originalMsgSender] = true;

        bool voteFound;
        bool vote;
        for (uint256 i = 0; i < params.length; i++) {
            if (params[i].key == keccak256("lens.param.vote")) {
                voteFound = true;
                vote = abi.decode(params[i].value, (bool));
                break;
            }
        }

        require(voteFound, "Vote not found in params");

        _voteCounts[feed][postId][vote]++;

        emit PollVoted(originalMsgSender, postId, vote);

        return abi.encode(vote);
    }

    /**
     * @notice Gets the vote counts for a specific post.
     * @param feed The address of the feed contract where the post exists.
     * @param postId The ID of the post to get vote counts for.
     * @return ya The count of false votes
     * @return nay The count of true votes
     */
    function getVoteCounts(
        address feed,
        uint256 postId
    ) external view returns (uint256 ya, uint256 nay) {
        return (
            _voteCounts[feed][postId][false],
            _voteCounts[feed][postId][true]
        );
    }
}
