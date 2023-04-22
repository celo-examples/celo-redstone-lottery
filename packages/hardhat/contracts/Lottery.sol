//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "redstone-evm-connector/lib/contracts/message-based/PriceAwareOwnable.sol";

contract Lottery is PriceAwareOwnable {

    uint256 private totalLotteries = 0;

    struct LotteryStruct {
        uint256 id;
        string title;
        uint256 ticketPrice;
        uint256[] luckyNumbers;
        uint256[] selectedLuckyNumbers;
        uint256 participantCount;
        bool ended;
        address owner;
        uint256 createdAt;
        uint256 expiresAt;
    }

    struct ParticipantStruct {
        address payable account;
        uint256 luckyNumber;
        bool paid;
    }

    mapping(uint256 => LotteryStruct) lotteries;
    mapping(uint256 => ParticipantStruct) lotteryParticipants;

    event Random(uint256 rand);

    //constructor(uint _ticketPrice) {

    //}

     function createLottery(string memory title, uint256 ticketPrice, uint256 expiresAt) public {
        require(bytes(title).length > 0, "Title can't be empty");
        require(ticketPrice > 0 ether, "Ticket Price cannot be zero");
        require( expiresAt > block.timestamp, "Expiration date cannot be less than the future" );

        uint256 randomness = random();
        uint256[] memory _luckyNumbers = new uint256[](10);
        uint256 maxValue = 1000;

        for (uint i = 0; i < 10; i++) {
          _luckyNumbers[i] = uint256(keccak256(abi.encode(randomness, i))) % maxValue + 1;
        }

        LotteryStruct memory lottery;

        lottery.id = totalLotteries;
        lottery.title = title;
        lottery.luckyNumbers = _luckyNumbers;
        lottery.ticketPrice = ticketPrice;
        lottery.owner = msg.sender;
        lottery.createdAt = block.timestamp;
        lottery.expiresAt = expiresAt;

        lotteries[lottery.id] = lottery;

        totalLotteries ++;
        }

    function enter(uint256 _id) public payable {

        LotteryStruct storage lottery = lotteries[_id];

        require(msg.sender != lottery.owner, "Owner can't participate" );
        require(block.timestamp * 1000 >= lottery.expiresAt, "End time reached");
        require(msg.value >= lottery.ticketPrice, "insufficient payment" );

        uint256 luckyNumber;
        uint256[] memory selectedLuckyNumbers = lottery.selectedLuckyNumbers;
        bool numberAlreadySelected;

        do {
            // generate a random index within the range of luckyNumbers array
            uint256 index = uint256(keccak256(abi.encodePacked(block.timestamp))) % lottery.luckyNumbers.length;
            //uint256 index = 0;
            luckyNumber = lottery.luckyNumbers[index];
            // check if the number has already been selected by the current participant
            numberAlreadySelected = false;
            for (uint256 i = 0; i < selectedLuckyNumbers.length; i++) {
                if (selectedLuckyNumbers[i] == luckyNumber) {
                    numberAlreadySelected = true;
                    break;
                }
            }
        } while (numberAlreadySelected);

        ParticipantStruct storage participant = lotteryParticipants[_id];
        participant.account = payable(msg.sender);
        participant.luckyNumber = luckyNumber;
        participant.paid = false;

        lottery.participantCount ++;

        lottery.selectedLuckyNumbers.push(luckyNumber);
    }

    function pickWinner(uint256 _id) public {
        LotteryStruct storage lottery = lotteries[_id];
        ParticipantStruct storage lotteryParticipant = lotteryParticipants[_id];
        uint256 totalLotteryAmount = lottery.ticketPrice * lottery.participantCount;

   //Shuffle randoom number and select one

        lotteryParticipant.account.transfer(totalLotteryAmount);
        lottery.ended = true;
        //emit Random(index);
    }

    function getLottery(uint256 _id) public view returns (
        uint256 id,
        string memory title,
        uint256 ticketPrice,
        uint256[] memory luckyNumbers,
        uint256 participants,
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
            _lottery.luckyNumbers,
            _lottery.participantCount,
            _lottery.ended,
            _lottery.owner,
            _lottery.createdAt,
            _lottery.expiresAt
        );
    }

    function getParticipant(uint256 _id) public view returns (
            address account,
            uint256 luckyNumber,
            bool paid

        )  {
            ParticipantStruct storage _participant = lotteryParticipants[_id];

            return (
                _participant.account,
                _participant.luckyNumber,
                _participant.paid
            );
        }

    function random() private view returns (uint256) {

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

    function getLotteryCount() public view returns (uint256) {
     return totalLotteries;
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
