import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ textAlign: "center", paddingTop: "40px" }}>
      <h1 style={{ fontSize: "40px", marginBottom: "20px" }}>Raffle DApp</h1>

      <p style={{ color: "#d8d8ff", marginBottom: "32px" }}>
        Connect your wallet and participate!
      </p>

      <div className="space-y-6 text-center">
        <Link
          to="/raffle"
          className="px-10 py-4 bg-purple-600 text-xl rounded-2xl shadow-xl hover:bg-purple-700 transition"
        >
        <a
          href="/raffle"
          style={{
            padding: "12px 24px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "12px",
            marginRight: "12px",
            }}
        >
        라플 참여하기
        </a>
        </Link>

        <Link
          to="/history"
          className="px-10 py-4 bg-blue-600 text-xl rounded-2xl shadow-xl hover:bg-blue-700 transition"
        >
        <a
            href="/history"
            style={{
            padding: "12px 24px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "12px",
            }}
        >
            히스토리 보기
        </a>
        </Link>
      </div>
    </div>
  );
}