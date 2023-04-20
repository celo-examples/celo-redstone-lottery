//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "redstone-evm-connector/lib/contracts/message-based/PriceAwareOwnable.sol";

contract Lottery is PriceAwareOwnable {

    uint256 private _totalLotteries;

    struct LotteryStruct {
        uint256 id;
        string title;
        uint256 ticketPrice;
        address[] participants;
        bool ended;
        address owner;
        uint256 createdAt;
        uint256 expiresAt;
    }

    mapping(uint256 => LotteryStruct) lotteries;

    event Random(uint256 rand);

    //constructor(uint _ticketPrice) {

    //}

     function createLottery(string memory title, uint256 ticketPrice, uint256 expiresAt) public {
        require(bytes(title).length > 0, "Title can't be empty");
        require(ticketPrice > 0 ether, "TicketPrice cannot be zero");
        require( expiresAt > block.timestamp, "Expiration date cannot be less than the future" );

        LotteryStruct memory lottery;

        lottery.id = _totalLotteries;
        lottery.title = title;
        lottery.ticketPrice = ticketPrice;
        lottery.owner = msg.sender;
        lottery.createdAt = block.timestamp;
        lottery.expiresAt = expiresAt;

        lotteries[lottery.id] = lottery;

        _totalLotteries ++;
        }

    function enter(uint256 _id) public payable {

        LotteryStruct storage lottery = lotteries[_id];

        require(msg.sender != lottery.owner, "Owner can't participate" );
        require(block.timestamp * 1000 >= lottery.expiresAt, "End time reached");
        require(msg.value >= lottery.ticketPrice, "insufficient payment" );

        lottery.participants.push(msg.sender);
    }

    function pickWinner(uint256 _id) public {
        LotteryStruct storage lottery = lotteries[_id];
        uint256 totalLotteryAmount = lottery.ticketPrice * lottery.participants.length;
        uint256 index = random() % lottery.participants.length;
        payable(lottery.participants[index]).transfer(totalLotteryAmount);
        lottery.ended = true;
        emit Random(index);
    }

    function getLottery(uint256 _id) public view returns (
        uint256 id,
        string memory title,
        uint256 ticketPrice,
        address[] memory participants,
        bool ended,
        address owner,
        uint256 createdAt,
        uint256 expiresAt
    )  {
        LotteryStruct memory _lottery = lotteries[_id];

        return (
            _lottery.id,
            _lottery.title,
            _lottery.ticketPrice,
            _lottery.participants,
            _lottery.ended,
            _lottery.owner,
            _lottery.createdAt,
            _lottery.expiresAt
        );
    }

    function random() private view returns (uint256) {

        uint256 randomValue = getPriceFromMsg(bytes32("ENTROPY"));

            return uint256(
              keccak256(
                abi.encodePacked(
                  randomValue,
                  block.timestamp,
                  blockhash(block.number - 1),
                  blockhash(block.number)
                )
              )
            );

        //return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, lotteries[_id].participants.length)));
    }

    function getLotteryCount() public view returns (uint256) {
     return _totalLotteries;
    }
 function test() public view returns (uint256) {

    uint256 randomValue = getPriceFromMsg(bytes32("ENTROPY"));

        return uint256(
          keccak256(
            abi.encodePacked(
              randomValue,
              block.timestamp / 1000,
              blockhash(block.number - 1),
              blockhash(block.number)
            )
          )
        );
    }

}
