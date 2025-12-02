import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { WagmiConfig, createConfig } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { http } from "viem";
import { ConnectKitProvider } from "connectkit";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

// react-query 클라이언트 생성
const queryClient = new QueryClient();

// wagmi 설정
const config = createConfig({
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: http(),
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={config}>
          <ConnectKitProvider>
            <App />
          </ConnectKitProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);