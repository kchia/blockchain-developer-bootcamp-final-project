import { useMemo, useEffect, useState } from "react";
import { Contract } from "@ethersproject/contracts";
import { AddressZero } from "@ethersproject/constants";
import { useWeb3React } from "@web3-react/core";

export default function useContract(contractAddress, ABI) {
  const [signerOrProvider, setSignerOrProvider] = useState(undefined);
  const { library, account } = useWeb3React();
  if (contractAddress === AddressZero) {
    throw Error(`Invalid 'contractAddress' parameter '${contractAddress}'.`);
  }

  useEffect(() => {
    if (library) {
      setSignerOrProvider(
        account ? library.getSigner(account).connectUnchecked() : library
      );
    }
  }, [library]);

  return useMemo(() => {
    return library
      ? new Contract(contractAddress, ABI, signerOrProvider)
      : null;
  }, [contractAddress, ABI, signerOrProvider]);
}
