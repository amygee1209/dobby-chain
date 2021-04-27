import web3 from "./Web3";
import KSEA_Airdrop from "../../abis/KSEAirdrop.json";

const kseAirdrop = async () => {
  const airdrop = new web3.eth.Contract(KSEA_Airdrop.abi, "0x979732e637f161903C81C1a2f66C820122129C41")
  console.log("airdrop address:", airdrop.options.address);
  return airdrop;
}

export default kseAirdrop;