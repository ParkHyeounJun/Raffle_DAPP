import { ConnectKitButton } from "connectkit";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { RaffleABI } from "./contracts/RaffleABI";
import { useState } from "react";
import { Ticket, Trophy, Users, DollarSign, TrendingUp, Sparkles, Clock, AlertCircle, Zap, Crown, Activity } from "lucide-react";
import { formatEther } from "viem";

const CONTRACT_ADDRESS = "0xb14fddf77625b7c44343ae0447e0e9493a2495bd";

function App() {
  const { address, isConnected } = useAccount();
  const [entryTimes, setEntryTimes] = useState(1);

  const { writeContract: writeEnter, isPending: isEntering } = useWriteContract();
  const { writeContract: writeEnterMultiple, isPending: isEnteringMultiple } = useWriteContract();
  const { writeContract: writePick, isPending: isPicking } = useWriteContract();
  const { writeContract: writeToggle } = useWriteContract();
  const { writeContract: writeReset } = useWriteContract();

  // Read contract data
  const { data: players } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: RaffleABI,
    functionName: "getPlayers",
  });

  const { data: winner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: RaffleABI,
    functionName: "winner",
  });

  const { data: entryFeeRaw } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: RaffleABI,
    functionName: "entryFee",
  });

  // 명확한 타입으로 변환
  const entryFee = entryFeeRaw as bigint | undefined;

  const { data: prizePool } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: RaffleABI,
    functionName: "getPrizePool",
  });

  const { data: myEntryCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: RaffleABI,
    functionName: "getMyEntryCount",
  });

  const { data: raffleHistory } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: RaffleABI,
    functionName: "getRaffleHistory",
  });

  const { data: owner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: RaffleABI,
    functionName: "owner",
  });

  const { data: isActive } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: RaffleABI,
    functionName: "isActive",
  });

  const { data: playerCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: RaffleABI,
    functionName: "getPlayerCount",
  });

  const { data: myWinCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: RaffleABI,
    functionName: "getWinCount",
    args: address ? [address] : undefined,
  });

  const isOwner = address && owner && (address as string).toLowerCase() === (owner as string).toLowerCase();
  const isLoading = isEntering || isEnteringMultiple || isPicking;

  const handleEnter = () => {
    if (!entryFee) return;
    
    const fee = BigInt(String(entryFee));
    const times = BigInt(entryTimes);
    
    if (entryTimes === 1) {
      writeEnter({
        address: CONTRACT_ADDRESS,
        abi: RaffleABI,
        functionName: "enter",
        value: fee,
      });
    } else {
      writeEnterMultiple({
        address: CONTRACT_ADDRESS,
        abi: RaffleABI,
        functionName: "enterMultiple",
        args: [times],
        value: fee * times,
      });
    }
  };

  const handlePickWinner = () => {
    writePick({
      address: CONTRACT_ADDRESS,
      abi: RaffleABI,
      functionName: "pickWinner",
    });
  };

  const handleToggleRaffle = () => {
    writeToggle({
      address: CONTRACT_ADDRESS,
      abi: RaffleABI,
      functionName: "toggleRaffle",
    });
  };

  const handleResetRaffle = () => {
    writeReset({
      address: CONTRACT_ADDRESS,
      abi: RaffleABI,
      functionName: "resetRaffle",
    });
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-x-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-0 -left-20"></div>
        <div className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bottom-0 -right-20" style={{animationDelay: '2s'}}></div>
        <div className="absolute w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex justify-center">
        <div className="w-full max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
          
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-2xl mb-4 sm:mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
              🎰 Raffle DApp
            </h1>
            <p className="text-lg sm:text-xl text-purple-200 mb-4">
              Enter for a chance to win the prize pool! 💎
            </p>
            
            {/* Status Badge */}
            {isActive !== undefined && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                <span className="text-sm font-semibold text-white">
                  {isActive ? 'Raffle Active' : 'Raffle Paused'}
                </span>
              </div>
            )}
          </div>

          {/* Connect Wallet */}
          <div className="flex justify-center mb-8 sm:mb-12">
            {!isConnected ? (
              <div className="transform hover:scale-105 transition-transform duration-200">
                <ConnectKitButton />
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-3 border border-white/20">
                <p className="text-sm text-purple-200 mb-1">Connected Wallet</p>
                <p className="text-white font-mono text-sm">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>
            )}
          </div>

          {isConnected && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Prize Pool */}
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30 shadow-2xl hover:scale-105 transition-transform">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-yellow-500 p-2 rounded-lg">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-yellow-200">Prize Pool</h3>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {prizePool ? formatEther(prizePool as bigint) : "0"} ETH
                  </p>
                </div>

                {/* Total Players */}
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30 shadow-2xl hover:scale-105 transition-transform">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-500 p-2 rounded-lg">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-blue-200">Total Entries</h3>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {playerCount ? String(playerCount) : "0"}
                  </p>
                </div>

                {/* Entry Fee */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30 shadow-2xl hover:scale-105 transition-transform">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-purple-500 p-2 rounded-lg">
                      <Ticket className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-purple-200">Entry Fee</h3>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {entryFee ? formatEther(entryFee as bigint) : "0"} ETH
                  </p>
                </div>

                {/* My Entries */}
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30 shadow-2xl hover:scale-105 transition-transform">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-green-500 p-2 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-green-200">My Entries</h3>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {myEntryCount ? String(myEntryCount) : "0"}
                  </p>
                </div>
              </div>

              {/* My Stats Card */}
              {myWinCount !== undefined && Number(myWinCount) > 0 && (
                <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-lg rounded-2xl p-6 border border-amber-500/30 shadow-2xl">
                  <div className="flex items-center justify-center gap-3">
                    <Crown className="w-6 h-6 text-yellow-400" />
                    <p className="text-lg text-white font-semibold">
                      🎉 You have won {String(myWinCount)} time{Number(myWinCount) > 1 ? 's' : ''}! 🎉
                    </p>
                  </div>
                </div>
              )}

              {/* Warning if raffle is inactive */}
              {isActive === false && (
                <div className="bg-red-500/20 backdrop-blur-lg rounded-2xl p-6 border border-red-500/30 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                    <p className="text-lg text-red-200 font-semibold">
                      Raffle is currently paused. Please wait for it to be activated.
                    </p>
                  </div>
                </div>
              )}

              {/* Entry Section */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Ticket className="w-6 h-6 text-yellow-400" />
                  Enter Raffle
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-purple-200 mb-2 text-sm sm:text-base">
                      Number of Entries (1-10)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={entryTimes}
                      onChange={(e) => setEntryTimes(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={!isActive}
                    />
                    {entryFee !== undefined && (
                      <p className="text-purple-300 text-sm mt-2">
                        Total Cost: {formatEther(entryFee * BigInt(entryTimes))} ETH
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleEnter}
                    disabled={isLoading || !isActive}
                    className="w-full group relative bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 sm:py-6 px-8 rounded-2xl shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-200 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <div className="relative flex items-center justify-center gap-3">
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="text-lg sm:text-xl">
                        {isLoading ? "Processing..." : entryTimes === 1 ? "Enter Raffle" : `Enter ${entryTimes} Times`}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Owner Controls */}
              {isOwner && (
                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-orange-500/30 shadow-2xl">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Crown className="w-6 h-6 text-yellow-400" />
                    Owner Controls
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <button
                      onClick={handlePickWinner}
                      disabled={isLoading || !players || (players as any[]).length === 0}
                      className="group relative bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold py-4 px-6 rounded-xl shadow-xl hover:shadow-yellow-500/50 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Trophy className="w-5 h-5" />
                        <span>Pick Winner</span>
                      </div>
                    </button>

                    <button
                      onClick={handleToggleRaffle}
                      className="group relative bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold py-4 px-6 rounded-xl shadow-xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-200"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Activity className="w-5 h-5" />
                        <span>{isActive ? 'Pause' : 'Activate'}</span>
                      </div>
                    </button>

                    <button
                      onClick={handleResetRaffle}
                      className="group relative bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold py-4 px-6 rounded-xl shadow-xl hover:shadow-red-500/50 transform hover:scale-105 transition-all duration-200"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        <span>Reset</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Players & Winner Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Players Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-500 p-3 rounded-xl">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">Active Players</h3>
                  </div>

                  <div className="bg-black/30 rounded-xl p-4 max-h-64 overflow-y-auto custom-scrollbar">
                    {players && Array.isArray(players) && players.length > 0 ? (
                      <div className="space-y-2">
                        {(players as string[]).map((player: string, index: number) => (
                          <div
                            key={index}
                            className="bg-white/5 rounded-lg p-3 font-mono text-xs sm:text-sm text-purple-200 hover:bg-white/10 transition-colors break-all"
                          >
                            <span className="text-blue-400 font-bold">{index + 1}.</span> {player}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-purple-300">No players yet</p>
                        <p className="text-purple-400 text-sm mt-2">Be the first to enter!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Current Winner Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-yellow-500 p-3 rounded-xl">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">Latest Winner</h3>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 min-h-[200px] flex items-center justify-center">
                    {winner && winner !== "0x0000000000000000000000000000000000000000" ? (
                      <div className="text-center">
                        <div className="text-6xl mb-4 animate-bounce">🎉</div>
                        <p className="text-yellow-300 font-mono text-xs sm:text-sm break-all bg-black/30 p-4 rounded-lg">
                          {String(winner)}
                        </p>
                        <p className="text-yellow-200 mt-4 font-semibold">Congratulations! 🏆</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-6xl mb-4 opacity-50">🏆</div>
                        <p className="text-purple-300 text-lg">No winner yet</p>
                        <p className="text-purple-400 text-sm mt-2">
                          Waiting for the draw...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Raffle History */}
              {raffleHistory && Array.isArray(raffleHistory) && raffleHistory.length > 0 && (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-purple-500 p-3 rounded-xl">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">Raffle History</h3>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                    {[...raffleHistory].reverse().map((round: any, index: number) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-colors"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex-1">
                            <p className="text-purple-200 text-xs mb-1">Winner</p>
                            <p className="text-white font-mono text-xs break-all">
                              {String(round.winner)}
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-purple-200 text-xs mb-1">Prize</p>
                              <p className="text-yellow-400 font-bold text-sm">
                                {formatEther(round.prizeAmount as bigint).toString()} ETH
                              </p>
                            </div>
                            <div>
                              <p className="text-purple-200 text-xs mb-1">Players</p>
                              <p className="text-blue-400 font-bold text-sm">
                                {String(round.participantCount)}
                              </p>
                            </div>
                            <div>
                              <p className="text-purple-200 text-xs mb-1">Date</p>
                              <p className="text-gray-300 text-xs">
                                {formatDate(round.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!isConnected && (
            <div className="text-center py-20">
              <div className="text-7xl sm:text-8xl mb-6 animate-bounce">🎰</div>
              <p className="text-xl sm:text-2xl text-purple-200 mb-4">
                Connect your wallet to get started
              </p>
              <p className="text-purple-400">
                Enter the raffle and win amazing prizes!
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

export default App;