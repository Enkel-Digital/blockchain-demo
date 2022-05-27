import sha256 from "crypto-js/sha256";

export default function pow({
  blockData,
  difficulty,
}: {
  blockData: string;
  difficulty: number;
}) {
  console.log("Computing POW in web worker");

  const leadingZeros = "0".repeat(difficulty);

  let pow = 0;
  let hash: string;

  do {
    hash = sha256(blockData + pow++).toString();
  } while (hash.substring(0, difficulty) !== leadingZeros);

  return { hash, pow };
}

// Run the pow function on any message
self.onmessage = (e) => self.postMessage(pow(e.data));
