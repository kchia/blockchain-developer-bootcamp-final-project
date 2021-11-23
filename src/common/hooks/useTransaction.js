import { useAppContext } from "../../app/AppContext";

export default function useTransaction() {
  const { setTxnStatus, txnStatus } = useAppContext();
  return { setTxnStatus, txnStatus };
}
