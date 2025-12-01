// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Raffle {
    address public owner;
    address[] public players;
    address public winner;
    uint public entryFee;
    uint public prizePool;
    bool public isActive;
    
    // 히스토리 추적
    struct RaffleRound {
        address winner;
        uint prizeAmount;
        uint timestamp;
        uint participantCount;
    }
    RaffleRound[] public raffleHistory;
    
    // 참가자별 참가 횟수 추적
    mapping(address => uint) public entryCount;
    
    // 이벤트
    event PlayerEntered(address indexed player, uint entryCount);
    event WinnerPicked(address indexed winner, uint prizeAmount);
    event RaffleReset(uint timestamp);
    event EntryFeeChanged(uint newFee);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    modifier raffleActive() {
        require(isActive, "Raffle is not active");
        _;
    }
    
    constructor(uint _entryFee) {
        owner = msg.sender;
        entryFee = _entryFee;
        isActive = true;
    }
    
    // 참가비를 내고 래플 참가
    function enter() public payable raffleActive {
        require(msg.value == entryFee, "Incorrect entry fee");
        
        players.push(msg.sender);
        entryCount[msg.sender]++;
        prizePool += msg.value;
        
        emit PlayerEntered(msg.sender, entryCount[msg.sender]);
    }
    
    // 여러 번 참가 (확률 높이기)
    function enterMultiple(uint times) public payable raffleActive {
        require(msg.value == entryFee * times, "Incorrect total fee");
        require(times > 0 && times <= 10, "Can enter 1-10 times");
        
        for(uint i = 0; i < times; i++) {
            players.push(msg.sender);
        }
        entryCount[msg.sender] += times;
        prizePool += msg.value;
        
        emit PlayerEntered(msg.sender, entryCount[msg.sender]);
    }
    
    // 당첨자 선정
    function pickWinner() public onlyOwner raffleActive {
        require(players.length > 0, "No players");
        
        uint rand = uint(
            keccak256(
                abi.encodePacked(block.timestamp, block.prevrandao, players.length)
            )
        );
        uint index = rand % players.length;
        winner = players[index];
        
        // 상금 지급
        uint prize = prizePool;
        prizePool = 0;
        
        // 히스토리 저장
        raffleHistory.push(RaffleRound({
            winner: winner,
            prizeAmount: prize,
            timestamp: block.timestamp,
            participantCount: players.length
        }));
        
        // 상금 전송
        (bool success, ) = winner.call{value: prize}("");
        require(success, "Transfer failed");
        
        emit WinnerPicked(winner, prize);
        
        // 자동 리셋
        resetRaffle();
    }
    
    // 래플 리셋
    function resetRaffle() public onlyOwner {
        delete players;
        winner = address(0);
        
        emit RaffleReset(block.timestamp);
    }
    
    // 참가비 변경
    function setEntryFee(uint _newFee) public onlyOwner {
        entryFee = _newFee;
        emit EntryFeeChanged(_newFee);
    }
    
    // 래플 활성화/비활성화
    function toggleRaffle() public onlyOwner {
        isActive = !isActive;
    }
    
    // 긴급 상황시 자금 회수 (참가자가 없을 때만)
    function emergencyWithdraw() public onlyOwner {
        require(players.length == 0, "Cannot withdraw with active players");
        
        uint balance = address(this).balance;
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Transfer failed");
    }
    
    // View 함수들
    function getPlayers() public view returns (address[] memory) {
        return players;
    }
    
    function getPlayerCount() public view returns (uint) {
        return players.length;
    }
    
    function getPrizePool() public view returns (uint) {
        return prizePool;
    }
    
    function getMyEntryCount() public view returns (uint) {
        return entryCount[msg.sender];
    }
    
    function getRaffleHistory() public view returns (RaffleRound[] memory) {
        return raffleHistory;
    }
    
    function getLatestWinner() public view returns (address, uint, uint) {
        require(raffleHistory.length > 0, "No raffle history");
        RaffleRound memory latest = raffleHistory[raffleHistory.length - 1];
        return (latest.winner, latest.prizeAmount, latest.timestamp);
    }
    
    // 특정 주소의 당첨 횟수
    function getWinCount(address player) public view returns (uint) {
        uint count = 0;
        for(uint i = 0; i < raffleHistory.length; i++) {
            if(raffleHistory[i].winner == player) {
                count++;
            }
        }
        return count;
    }
}