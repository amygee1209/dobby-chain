import FactoryAbi from "../../abis/AuctionFactory.json";
import web3 from "./Web3";

//function factoryFunc({provider})
const factory = async () => {
    // Network ID
    const networkId = await web3.eth.net.getId()

    // AuctionFactory
    const networkData3 = FactoryAbi.networks[networkId]
    if(networkData3) {
      const auctionFactory = new web3.eth.Contract(FactoryAbi.abi, networkData3.address)
      // console.log("auctionFactory", auctionFactory.options.address);

      return auctionFactory
    } else {
      // ***Devs*** uncomment this after deploying smart contracts
      // window.alert('Auction contract not deployed to detected network.')
      console.log('Smart contracts not deployed to detected network.')
    }
  }

  export default factory;
