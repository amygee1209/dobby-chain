import FactoryAbi from "../../abis/AuctionFactory.json";
import web3 from "./Web3";

//function factoryFunc({provider})
const factory = async () => {
  const auctionFactory = new web3.eth.Contract(FactoryAbi.abi, "0x634015a3E713631867BBe190297ffB393549eFbd")
  console.log("auctionFactory", auctionFactory.options.address);
  return auctionFactory
}

  export default factory;
