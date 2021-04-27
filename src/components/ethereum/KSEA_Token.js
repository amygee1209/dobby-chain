import web3 from "./Web3";
import KSEA_Token from "../../abis/KSEAToken.json";

//function kseaTokenFunc({provider}) {
const kseaToken = async () => {
  const token = new web3.eth.Contract(KSEA_Token.abi, "0x692B98Fa3971Eed67d66DFB41B662667627A310a")
  console.log("token: ", token.options.address);
  return token;
};

export default kseaToken;