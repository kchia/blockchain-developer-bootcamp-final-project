import { useMemo, useEffect, useState } from "react";
import { Contract } from "@ethersproject/contracts";
import { AddressZero } from "@ethersproject/constants";
import { useWeb3React } from "@web3-react/core";

export default function useContract(contractAddress, ABI) {
  const { library, account } = useWeb3React();
  const [signerOrProvider, setSignerOrProvider] = useState(library);
  if (contractAddress === AddressZero) {
    throw Error(`Invalid 'contractAddress' parameter '${contractAddress}'.`);
  }

  useEffect(() => {
    if (library) {
      setSignerOrProvider(
        account ? library.getSigner(account).connectUnchecked() : library
      );
    }
  }, [library, account]);

  return useMemo(() => {
    return new Contract(contractAddress, ABI, signerOrProvider);
  }, [contractAddress, ABI, signerOrProvider]);
}
