import { Stack } from "@chakra-ui/layout";
import "./FAQ.css";

export default function FAQ() {
  return (
    <Stack spacing={7} id="faq-section">
      <Stack spacing={3}>
        <h1>
          What is Ethereum? A smart contract? ERC-20 Token? 
        </h1>
        <div>
          <p>
            <em style={{textDecoration: "none"}}>Ethereum network </em>
            is an open-source blockchain with smart contract functionality. 
          </p>
          <p>
            <em>Smart contracts</em> are programs stored on a blockchain that run 
            when certain predetermined conditions are met. 
          </p>
          <p>
            An <em>ERC-20 token</em> is a blockchain-based asset 
            that can hold value, be sent and received; 
            it is very similar to bitcoin. 
            ERC-20 tokens are stored and sent using ethereum addresses 
            and transactions, and each and every transaction costs 
            a transaction fee known as the gas fee. 
          </p>
        </div>
      </Stack>
      <Stack spacing={3}>
        <h1>
          Why Do We Need Metamask? (What is it?) 
        </h1>
        <p>
          Our application is deployed on the Ethereum network, 
          an open-source blockchain with smart contract functionality. 
          When users interact with our deployed smart contracts, 
          they will use a wallet called <em>Metamask.</em> Metamask serves as a wallet that stores cryptocurrencies 
          like Ether and Dobby tokens, and it also acts as the gateway 
          that connects Web 2.0 (the internet we know) 
          to Web 3.0 (the blockchain-powered internet). 
          Learning to install and use these wallets has a huge learning curve, 
          but it is very powerful.
        </p>
      </Stack>
      <Stack spacing={3}>
        <h1>
          It is Taking Forever to Make A Bid! Is Something Wrong?
        </h1>
        <p>
          One of the largest downfalls to the revolutionary blockchain technology: 
          Blockchain is slow! To be more precise, 
          public blockchains like Bitcoin and Ethereum are slow, 
          because they are decentralized. 
          Blockchain is a collection of computers that stores the same database 
          and executes the same operation. 
          So, if you transfer your Dobby tokens to your friend, 
          the entire network must verify that transaction 
          and give a thumbs up to let the transaction go through. 
          While this process is not only rigorous but also extremely repetitive, 
          it is essential to secure the integrity of the network. 
          Thankfully, there are a lot of efforts to make blockchain networks more scalable 
          (if interested, look up Layer 2 solutions or other scalable blockchains 
          such as Algorand, Solana, and Cardano) 
          and it is only a matter of time until such a problem disappears. 
          Until then, take a deep breath and counsel patience! 
        </p>
      </Stack>
      <Stack spacing={3}>
        <h1>
          Why Do I Need to Pay Ether to make a bid or send my tokens to my friend?
        </h1>
        <div>
          <p>
            All blockchain transactions cost money. 
            Blockchain is decentralized, which means 
            that there is no organization or a private company 
            that runs and secures the network. 
            Instead, the entire community that participates 
            in the network collectively works together to ensure 
            the security of the network. 
            This also means we need a way to prevent bad actors 
            from infinitely sending transactions to the network 
            and causing the network to crash in a decentralized manner. 
            The Ethereum network achieves this with what is called, 
            “gas fees”. Gas fees are commissions that we pay for each and every transaction, 
            and it mainly offers two benefits. 
            First, it prevents hackers from flooding the network 
            with empty function calls and crashing the network. 
            Second, the gas fees go to the validators who work hard to maintain 
            the integrity of the network. 
          </p>
          <p>
            So, are we going to make you pay money to use our application? 
            The answer is No! 
            Thankfully, the Ethereum blockchain has <b>test networks (Rinkeby Network)</b> that use fake ether for gas fees. 
            So, the ether that we are using is completely free! 
            Users will receive a certain amount of Ether 
            every semester to cover the gas fees.
          </p>
        </div>
      </Stack>
      <Stack spacing={3}>
        <h1>
          Why Blockchain?
        </h1>
        <div>
          <i>
            Until now, the online world was considered as the internet of information 
            where information was freely shared around the world.
             We call the current internet Web 2.0. However, web 2.0 has a critical flaw 
             that complicates digital financial interactions, and the flaw is 
             that it does not have native support for the digital transaction of value. 
             The internet is great, but everything online is mutable and copyable,
              meaning, if there is digital cash that represents a certain amount of value, 
              it can be infinitely copied and used for multiple transactions. 
              This problem is called the Double Spending problem. 
              Many computer scientists tackled this issue 
              (if interested, look up DigiCash or HashCash) 
              but they all failed until an unknown entity named Satoshi Nakamoto created Bitcoin.
          </i>
          <p>
            Bitcoin inspired many pioneers to experiment with the technology 
            that makes Bitcoin possible and the technology is called Blockchain. 
            Blockchain is rapidly changing the online environment and many 
            now consider Blockchain as the backbone of the next internet: An Internet of Value. 
          </p>
          <p>
            There are mainly two reasons why our team decided to use blockchain technology 
            to power the KSEA’s economy. First, as a member of the KSEA Association, 
            it is important to stay on top of the global trends to be able to grow and 
            lead technological development in the future. Blockchain is perhaps 
            the most disruptive technology that will greatly influence our daily lives, 
            and we wanted to give our users a taste of what the future of the internet 
            looks like. Second, KSEA has a point system that keeps track of participation, 
            but the sole function of the points is to enforce minimum participation 
            by encouraging members to meet the minimum point requirements to remain 
            in the organization. No, KSEA points have no inherent value nor does it 
            provide a strong enough incentive for active participation and interaction among members. 
            To empower the point system, we used blockchain’s native support for digital currencies 
            (tokens) to create Dobby Tokens, which can be stored, transferred, 
            and used to purchase goods and services inside of KSEA. Utilizing the Ethereum blockchain network, 
            Dobby tokens are not copyable and therefore can represent a certain value per token. 
            We believe the Dobby token will act as an incentive for members to actively.
          </p>
        </div>
      </Stack>
    </Stack>
  )
}