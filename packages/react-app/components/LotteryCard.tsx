import { timestampToDate } from '../utils'
import {ethers} from "ethers";
import { useAccount } from 'wagmi'

interface LotteryCardProps {
  // id: number;
  // owner: string;
  title: string;
  price: number;
  // endTime: number;
  // ended: boolean;
  enterLotteryHandler: (id: number, price: number) => void;
}



const LotteryCard: React.FC<LotteryCardProps> = ({
     id,
     owner,
     title,
     price,
     endTime,
     ended,
     enterLotteryHandler
   }) => {

  const { address } = useAccount()


  return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h2 className="mb-2">{title}</h2>
        {/*<div className="flex justify-between">*/}
        {/*  <div className="mr-4">*/}
        {/*    <p>Current Bid</p>*/}
        {/*    <span>{ethers.utils.formatEther(highestBid)}</span>*/}
        {/*  </div>*/}
        {/*  <div>*/}
        {/*    <p>Auction End</p>*/}
        {/*    <span>{timestampToDate(endTime.toNumber())}</span>*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*<div>*/}
          {!ended && (owner !== address) && <button onClick={() => enterLotteryHandler(id, price)} className="mt-3 bg-slate-300 w-28 rounded">
            Bid
          </button>}
        {/*  {!ended && (owner === address) && <button onClick={() => endAuctionHandler(id)} className="mt-3 bg-slate-300 w-28 rounded">*/}
        {/*    End Auction*/}
        {/*  </button>}*/}
        {/*</div>*/}
      </div>
  );
};

export default LotteryCard
