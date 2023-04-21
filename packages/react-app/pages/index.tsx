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
      <button type={'button'} onClick={() => endLotteryHandler(0)}>Endlot</button>
      <LotteryForm updateList={getLotteryHandler}/>

        <div className="grid grid-cols-3 gap-4 mt-10">
          {lotteries && lotteries.map(lottery => (
            <LotteryCard
              key={lottery.id}
              id={lottery.id}
              owner={lottery.owner}
              title={lottery.title}
              price={lottery.ticketPrice}
              participants={lottery.participants.toNumber()}
              endTime={lottery.expiresAt}
              ended={lottery.ended}
              enterLotteryHandler={enterLotteryHandler}
              endLotteryHandler={endLotteryHandler}
            />
          ))}
      </div>
    </div>
  )
}

