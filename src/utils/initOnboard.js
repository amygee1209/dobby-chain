
import Onboard from 'bnc-onboard'

const networkId = 4
const dappId = 'a26b3ed4-031c-40da-bbf7-cf3f1f0ee190'

export default function initOnboard(subscriptions) {
  return Onboard({
    dappId,
    hideBranding: true,
    networkId,
    // darkMode: true,
    subscriptions,
    walletSelect: {
      wallets: [ {walletName: 'metamask'} ]
    }
  });
}