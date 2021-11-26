import { useMemo } from "react";
import { Contract } from "@ethersproject/contracts";
import { AddressZero } from "@ethersproject/constants";
import { useWeb3React } from "@web3-react/core";

export default function useContract(contractAddress, ABI) {
  const { library, account } = useWeb3React();
  if (contractAddress === AddressZero) {
    throw Error(`Invalid 'contractAddress' parameter '${contractAddress}'.`);
  }

  const signerOrProvider = account
    ? library.getSigner(account).connectUnchecked()
    : library;

  return useMemo(() => {
    return new Contract(contractAddress, ABI, signerOrProvider);
  }, [contractAddress, ABI, signerOrProvider]);
}
