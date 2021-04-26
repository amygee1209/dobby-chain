import web3 from "./Web3";
import KSEA_Airdrop from "../../abis/KSEAirdrop.json";

  const kseAirdrop = async () => {

      const networkId = await web3.eth.net.getId()

      // KSEA Airdrop
      const networkData2 = KSEA_Airdrop.networks[networkId]
      if(networkData2) {
        const airdrop = new web3.eth.Contract(KSEA_Airdrop.abi, networkData2.address)
      //   console.log("airdrop address:", airdrop.options.address)
        
        return airdrop
      } else {
        // ***Devs*** uncomment this after deploying smart contracts
        // window.alert('Airdrop contract not deployed to detected network.')
        console.log('Smart contracts not deployed to detected network.')
  
      }
  }

export default kseAirdrop;