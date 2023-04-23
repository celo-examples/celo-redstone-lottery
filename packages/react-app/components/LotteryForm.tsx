import { useState } from 'react'
import { toTimestamp, createLottery } from '../utils'

const LotteryForm = () => {

  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [ticketPrice, setTicketPrice] = useState('')
  const [endTime, setEndTime] = useState('')

  const createLotteryHandler = async () => {
    setLoading(true)
    await createLottery(title, ticketPrice, endTime)
    setLoading(false)
    window.location.reload()
  }

  return (

    <div>
      <h1 className="m-2  text-2xl">Lottery Dapp</h1>
      <form className="flex justify-between">
        <div className="flex items-center space-x-2">
          <label htmlFor="title" className="sr-only">Lottery Title</label>
          <input onChange={e => setTitle(e.target.value)} type="text" name="item-name" id="title" placeholder="Title"
                 className="w-40 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="item-price" className="sr-only">Ticket Price</label>
          <input onChange={e => setTicketPrice(e.target.value)} type="number" name="item-price" id="item-price" placeholder="Item Price"
                 className="w-24 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="datetime" className="sr-only">End Time</label>
          <input onChange={e => setEndTime(toTimestamp(e.target.value))} type="datetime-local" name="datetime" id="datetime" placeholder="Datetime"
                 className="w-40 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <button onClick={createLotteryHandler} type="button"
                className="ml-2 inline-flex items-center px-4 py-2 bg-blue-500 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          {loading ? 'Creating ...' : 'Create Lottery'}
        </button>
      </form>
    </div>

)}

export default LotteryForm