import "./Raffle.css";
import { Link } from "react-router-dom";
import { ConnectKitButton } from "connectkit";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { RaffleABI } from "../contracts/RaffleABI";
import { useState } from "react";
import {
  Ticket,
  Trophy,
  Users,
  DollarSign,
  TrendingUp,
  Sparkles,
  Clock,
  AlertCircle,
  Zap,
  Crown,
  Activity,
} from "lucide-react";
import { formatEther } from "viem";

const CONTRACT_ADDRESS = "0x7d361f7100458f7d1e92c86f7b7f595eae1357f8";

export default function Raffle() {
  const { address, isConnected } = useAccount();
  const [entryTimes, setEntryTimes] = useState(1);

  const { writeContract: writeEnter, isPending: isEntering } = useWriteContract();
  const { writeContract: writeEnterMultiple, isPending: isEnteringMultiple } = useWriteContract();
  const { writeContract: writePick, isPending: isPicking } = useWriteContract();
  const { writeContract: writeToggle } = useWriteContract();
  const { writeContract: writeReset } = useWriteContract();

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

  const isOwner =
    address &&
    owner &&
    (address as string).toLowerCase() === (owner as string).toLowerCase();

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
    if (!timestamp) return "N/A";
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  return (
    <div className="raffle-page">
      {/* ---- Home Back Button ---- */}
      <Link to="/" className="back-button">Home</Link>

      {/* ---- Animated Background ---- */}
      <div className="bg-bubble bg-bubble-1"></div>
      <div className="bg-bubble bg-bubble-2"></div>
      <div className="bg-bubble bg-bubble-3"></div>

      {/* ---- Main Container ---- */}
      <div className="raffle-container">

        {/* ⭐ Header Section */}
        <div className="raffle-header">
          <div className="sparkle-icon">
            <Sparkles size={38} color="white" />
          </div>

          <h1 style={{ fontSize: "48px", fontWeight: 800, marginBottom: "12px" }}>
            Raffle DApp
          </h1>

          <p style={{ fontSize: "18px", color: "#d5caff" }}>
            Enter for a chance to win the prize pool!
          </p>

          {/* Status Badge */}
          {isActive !== undefined && (
            <div className="status-badge">
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: isActive ? "#3cff75" : "#ff5858",
                }}
              ></div>
              <span>{isActive ? "Raffle Active" : "Raffle Paused"}</span>
            </div>
          )}
        </div>

        {/* ⭐ Wallet Connect */}
        {!isConnected ? (
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <ConnectKitButton />
          </div>
        ) : (
          <div className="wallet-box">
            <p style={{ fontSize: "13px", color: "#cabaff", marginBottom: "4px" }}>
              Connected Wallet
            </p>
            <p style={{ fontFamily: "monospace" }}>
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
        )}

        {/* ---------------- Core UI ---------------- */}
        {isConnected && (
          <div>

            {/* ⭐ Stats Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
                marginBottom: "32px",
              }}
            >

              {/* Prize Pool */}
              <div className="info-card">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <DollarSign />
                  <h3>Prize Pool</h3>
                </div>
                <p style={{ fontSize: "22px", marginTop: "8px" }}>
                  {prizePool ? formatEther(prizePool as bigint) : "0"} ETH
                </p>
              </div>

              {/* Total Entries */}
              <div className="info-card">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Users />
                  <h3>Total Entries</h3>
                </div>
                <p style={{ fontSize: "22px", marginTop: "8px" }}>
                  {playerCount ? String(playerCount) : "0"}
                </p>
              </div>

              {/* Entry Fee */}
              <div className="info-card">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Ticket />
                  <h3>Entry Fee</h3>
                </div>
                <p style={{ fontSize: "22px", marginTop: "8px" }}>
                  {entryFee ? formatEther(entryFee as bigint) : "0"} ETH
                </p>
              </div>

              {/* My Entries */}
              <div className="info-card">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <TrendingUp />
                  <h3>My Entries</h3>
                </div>
                <p style={{ fontSize: "22px", marginTop: "8px" }}>
                  {myEntryCount ? String(myEntryCount) : "0"}
                </p>
              </div>
            </div>

            {/* ⭐ Win Badge */}
            {myWinCount !== undefined && Number(myWinCount) > 0 && (
              <div
                className="info-card"
                style={{
                  border: "1px solid rgba(255, 210, 77, 0.5)",
                  background: "rgba(255, 210, 77, 0.15)",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "20px", fontWeight: 600 }}>
                    🎉 You have won {String(myWinCount)} time
                    {Number(myWinCount) > 1 ? "s" : ""}!
                  </p>
                </div>
              </div>
            )}

            {/* ⭐ Raffle Paused Warning */}
            {isActive === false && (
              <div
                className="info-card"
                style={{
                  border: "1px solid rgba(255, 90, 90, 0.5)",
                  background: "rgba(255, 90, 90, 0.2)",
                }}
              >
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <AlertCircle />
                  <p style={{ fontWeight: 500 }}>Raffle is currently paused.</p>
                </div>
              </div>
            )}

            {/* ⭐ Entry Box */}
            <div className="info-card">
              <h3 style={{ fontSize: "22px", marginBottom: "14px" }}>Enter Raffle</h3>

              <label style={{ fontSize: "14px", display: "block", marginBottom: "6px" }}>
                Number of Entries (1-10)
              </label>

              <input
                type="number"
                min="1"
                max="10"
                value={entryTimes}
                onChange={(e) =>
                  setEntryTimes(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "white",
                  marginBottom: "14px",
                }}
              />

              {entryFee !== undefined && (
                <p style={{ fontSize: "13px", color: "#d4caff", marginBottom: "14px" }}>
                  Total Cost: {formatEther(entryFee * BigInt(entryTimes))} ETH
                </p>
              )}

              <button
                onClick={handleEnter}
                disabled={isLoading || !isActive}
                className="button-main"
              >
                {isLoading
                  ? "Processing..."
                  : entryTimes === 1
                  ? "Enter Raffle"
                  : `Enter ${entryTimes} Times`}
              </button>
            </div>

            {/* ⭐ Owner Controls */}
            {isOwner && (
              <div className="info-card">
                <h3 style={{ fontSize: "22px", marginBottom: "16px" }}>
                  Owner Controls
                </h3>

                <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))" }}>
                  <button className="owner-button" onClick={handlePickWinner}>
                    Pick Winner
                  </button>
                  <button className="owner-button" onClick={handleToggleRaffle}>
                    {isActive ? "Pause" : "Activate"}
                  </button>
                  <button className="owner-button" onClick={handleResetRaffle}>
                    Reset
                  </button>
                </div>
              </div>
            )}

            {/* ⭐ Players & Winner Grid */}
            <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "1fr 1fr", marginTop: "30px" }}>

              {/* Active Players */}
              <div className="info-card">
                <h3 style={{ fontSize: "20px", marginBottom: "14px" }}>
                  Active Players
                </h3>
                <div className="custom-scrollbar" style={{ maxHeight: "230px", overflowY: "auto", paddingRight: "6px" }}>
                  {players && Array.isArray(players) && players.length > 0 ? (
                    players.map((p: string, i: number) => (
                      <div key={i} style={{ marginBottom: "8px", background: "rgba(255,255,255,0.1)", padding: "8px 10px", borderRadius: "10px", fontFamily: "monospace" }}>
                        {i + 1}. {p}
                      </div>
                    ))
                  ) : (
                    <p style={{ color: "#c5b9ff" }}>No players yet</p>
                  )}
                </div>
              </div>

              {/* Latest Winner */}
              <div className="info-card">
                <h3 style={{ fontSize: "20px", marginBottom: "14px" }}>
                  Latest Winner
                </h3>

                {winner &&
                winner !== "0x0000000000000000000000000000000000000000" ? (
                  <div style={{ textAlign: "center" }}>
                    <h2 style={{ fontSize: "48px", marginBottom: "14px" }}>🎉</h2>
                    <p style={{ background: "rgba(0,0,0,0.3)", padding: "10px", borderRadius: "10px", fontFamily: "monospace" }}>
                      {String(winner)}
                    </p>
                    <p style={{ marginTop: "10px", color: "#f0da7a" }}>Congratulations!</p>
                  </div>
                ) : (
                  <p style={{ color: "#c5b9ff" }}>No winner yet</p>
                )}
              </div>
            </div>

            {/* ⭐ Raffle History */}
            {raffleHistory && Array.isArray(raffleHistory) && raffleHistory.length > 0 && (
              <div className="info-card" style={{ marginTop: "30px" }}>
                <h3 style={{ fontSize: "20px", marginBottom: "16px" }}>Raffle History</h3>

                <div className="custom-scrollbar" style={{ maxHeight: "300px", overflowY: "auto", paddingRight: "6px" }}>
                  {[...raffleHistory].reverse().map((round: any, index: number) => (
                    <div
                      key={index}
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        padding: "14px",
                        borderRadius: "12px",
                        marginBottom: "12px",
                      }}
                    >
                      <p style={{ fontFamily: "monospace" }}>Winner: {String(round.winner)}</p>
                      <p>Prize: {formatEther(round.prizeAmount as bigint)} ETH</p>
                      <p>Players: {round.participantCount}</p>
                      <p>Date: {formatDate(round.timestamp)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Not Connected */}
        {!isConnected && (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <h2 style={{ fontSize: "50px", marginBottom: "20px" }}>🎰</h2>
            <p style={{ fontSize: "20px", marginBottom: "10px", color: "#ccbffb" }}>
              Connect your wallet to begin!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}