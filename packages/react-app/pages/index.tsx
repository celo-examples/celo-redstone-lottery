import { useEffect, useState } from 'react'
import { getLotteries, enter, endLottery } from '../utils'
import LotteryCard from '../components/LotteryCard'
import LotteryForm from '../components/LotteryForm'

type DoSomethingFunction = () => void;

interface HomeProps {
  updateList: DoSomethingFunction;
}


export default function Home(props: HomeProps) : JSX.Element{

  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [lotteries, setLotteries] = useState(undefined)
  const [selectedItemId, setSelectedItemId] = useState('')
  const [selectedItemValue, setSelectedItemValue] = useState('')

  const getLotteryHandler = async () => {
    const res = await getLotteries()
    setLotteries(res)
  }

  const enterLotteryHandler = (id, price) => {
    enter(id, price)
  }

  const endLotteryHandler = async id => {
    const res = await endLottery(id)
    console.log(res)
  }

  useEffect(() => {

    getLotteryHandler()

  }, [getLotteries])

  return (
    <div className="item-list">

      <LotteryForm updateList={getLotteryHandler}/>

        <div className="grid grid-cols-3 gap-4 mt-10">
          {lotteries && lotteries.map(lottery => (
            <LotteryCard
              key={lottery.id}
              id={lottery.id}
              owner={lottery.owner}
              title={lottery.title}
              price={lottery.ticketPrice}
              participants={lottery.participants.length}
              endTime={lottery.expiresAt}
              ended={lottery.ended}
              enterLotteryHandler={enterLotteryHandler}
              endLotteryHandler={endLotteryHandler}
            />
          ))}
      </div>

      {showForm && <div className="flex mt-3">
        <div className="">
          <label htmlFor="value" className="sr-only">End Time</label>
          <input onChange={e => setSelectedItemValue(e.target.value)} name="value" type="number" placeholder="Value"
                 className="w-20 px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <button onClick={sendBid} type="button"
                className="ml-2 inline-flex items-center px-4 bg-blue-500 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          {loading ? 'Sending ...' : 'Send'}
        </button>
      </div>}

    </div>
  )
}

