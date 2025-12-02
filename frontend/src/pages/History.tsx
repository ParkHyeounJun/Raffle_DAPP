import "./History.css";
import { Link } from "react-router-dom";
import { useReadContract } from "wagmi";
import { RaffleABI } from "../contracts/RaffleABI";
import { formatEther } from "viem";

const CONTRACT_ADDRESS = "0x7d361f7100458f7d1e92c86f7b7f595eae1357f8";

export default function History() {
  const { data: raffleHistory, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: RaffleABI,
    functionName: "getRaffleHistory",
  });

  const formatDate = (t: any) =>
    new Date(Number(t) * 1000).toLocaleString();

  return (
    <div className="history-page">

      <Link to="/" className="history-back-button">
        ← Home
      </Link>

      <div className="history-container">
        <h1 className="history-title">Raffle History</h1>

        {isLoading && <p className="history-loading">Loading history...</p>}

        {raffleHistory &&
          Array.isArray(raffleHistory) &&
          raffleHistory.length === 0 && (
            <p className="history-empty">히스토리가 없습니다.</p>
        )}

        {raffleHistory &&
          Array.isArray(raffleHistory) &&
          raffleHistory.length > 0 && (
            <div className="history-card-group">
              {[...raffleHistory].reverse().map((round: any, i: number) => (
                <div key={i} className="history-card">

                  <p className="history-winner-label">Winner</p>
                  <p className="history-winner-address">{round.winner}</p>

                  <div className="history-info-row">
                    <div className="history-info">
                      <p>Prize</p>
                      <p className="history-prize">
                        {formatEther(round.prizeAmount)} ETH
                      </p>
                    </div>

                    <div className="history-info">
                      <p>Players</p>
                      <p className="history-players">
                        {String(round.participantCount)}
                      </p>
                    </div>

                    <div className="history-info">
                      <p>Date</p>
                      <p className="history-date">
                        {formatDate(round.timestamp)}
                      </p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
        )}
      </div>
    </div>
  );
}