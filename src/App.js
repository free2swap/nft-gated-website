import {
  useAddress,
  useMetamask,
  useNetworkMismatch,
  ChainId,
  useNetwork,
  useEditionDrop,
  useNFTBalance,
  useClaimNFT,
} from "@thirdweb-dev/react";
import "./styles.css";

// truncates the address so it displays in a nice format
function truncateAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function App() {
  // allow user to connect to app with metamask, and obtain address
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const networkMismatched = useNetworkMismatch();
  const claimNFT = useClaimNFT();
  const [, switchNetwork] = useNetwork(); // Switch network

  // Replace this address with your NFT Drop address!
  const editionDrop = useEditionDrop(
    "0xB87457DC2b1802f3C0BE8d408Cbf907d242070f8"
  );
  const { data: balance, isLoading } = useNFTBalance(editionDrop, address, "0");

  const mintNft = () => {
    // Ensure they're on the right network (mumbai)
    if (networkMismatched) {
      switchNetwork(ChainId.Mumbai);
      return;
    }

    claimNFT.mutate(
      { to: address, quantity: 1 },
      {
        onSuccess: () => {
          console.log("Successfully minted!");
        },
        onError: (err) => {
          console.error("Failed to mint NFT", err);
        },
      },
    );
  };

  //if there isn't a wallet connected, display our connect MetaMask button
  if (!address) {
    return (
      <div className="container">
        <h1>Welcome to the Shape Club</h1>
        <button className="btn" onClick={connectWithMetamask}>
          Connect MetaMask
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container">
        <h1>Checking your wallet...</h1>
      </div>
    );
  }

  // if the user is connected and has an NFT from the drop, display text
  if (balance > 0) {
    return (
      <div>
        <h2>Congratulations! You have a Shape Membership Card! 🟦🔺🟣</h2>
      </div>
    );
  }

  // if there are no NFTs from collection in wallet, display button to mint
  return (
    <div className="container">
      <p className="address">
        There are no Shape Membership Card NFTs held by:{" "}
        <span className="value">{truncateAddress(address)}</span>
      </p>
      <button className="btn" disabled={claimNFT.isLoading} onClick={mintNft}>
        {claimNFT.isLoading ? "Minting..." : "Mint NFT"}
      </button>
    </div>
  );
}
