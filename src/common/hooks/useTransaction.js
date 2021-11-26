import { useState } from "react";

export default function useTransaction() {
  const { txHash, setTxHash } = useState("");
  const { txStatus, setTxStatus } = useState("");
  return { setTxStatus, setTxHash, txHash, txStatus };
}
