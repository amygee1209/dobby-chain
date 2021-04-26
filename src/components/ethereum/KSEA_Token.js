import web3 from "./Web3";
import KSEA_Token from "../../abis/KSEAToken.json";

//function kseaTokenFunc({provider}) {
const kseaToken = async () => {
        // Network ID
    const networkId = await web3.eth.net.getId()

    // KSEA Token
    const networkData1 = KSEA_Token.networks[networkId]
    if(networkData1) {
        const token = new web3.eth.Contract(KSEA_Token.abi, networkData1.address)
        // console.log("token: ", token);
        return token;
    } else {
        // ***Devs*** uncomment this after deploying smart contracts
        // window.alert('Token contract not deployed to detected network.')
        console.log('Smart contracts not deployed to detected network.')
    }
};

export default kseaToken;