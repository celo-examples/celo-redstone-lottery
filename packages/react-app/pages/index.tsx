import { useEffect, useState } from 'react'
import { getLotteries, enter, endLottery, getParticipant } from '../utils'
import LotteryCard from '../components/LotteryCard'
import LotteryForm from '../components/LotteryForm'


const Home = () => {

  const [lotteries, setLotteries] = useState(undefined)

  const getLotteryHandler = async () => {
    const res = await getLotteries()
    setLotteries(res)
  }

  const enterLotteryHandler = async (id, price) => {
    await enter(id, price)
    getLotteryHandler()
  }

  const getParticipantHandler = () => {
    getParticipant()
  }

  const endLotteryHandler = async id => {
    await endLottery(id)
    getLotteryHandler()
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
              participants={lottery.participants.toNumber()}
              winner={lottery.winner}
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

export default Home

