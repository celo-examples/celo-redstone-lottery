import { providers, Contract, ethers } from 'ethers'
import Lottery from '../../hardhat/artifacts/contracts/Lottery.sol/Lottery.json'
import { priceToWei } from './helpers'

export const contractAddress = '0x97b445cA5353B0Ab2B06081c8c57aa3c26213fB8'

export async function getContract() {

  let contract

  try {
    const { ethereum } = window

    const provider = new providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    contract = new Contract(contractAddress, Lottery.abi, signer)

  } catch (error) {
    console.log("ERROR:", error)
  }
  return contract
}

export const createLottery = async (title, ticketPrice, endTime) => {

  try {
    const contract = await getContract()
      const res = await contract.createLottery(title, priceToWei(ticketPrice), endTime)
      return await res.wait()
  } catch (e) {
    console.log(e)
  }
}

export const getLotteries = async () => {
  try {
    const contract = await getContract()
    const lotteryCount = await contract.getLotteryCount()

    let lotteries = []

    for (let i = 0; i < lotteryCount; i++) {
      const lottery = await contract.getLottery(i)
      lotteries.push(lottery)
    }

    return lotteries

  } catch (e) {
    console.log(e)
  }
}

export const enter = async (index, value) => {

  try {
    const contract = await getContract()
    let res = await contract.enter(index, {value: priceToWei(value)})
    res = await res.wait()
    return res

  } catch (e) {
    console.log(e)
  }
}

export const endLottery = async index => {

  try {
    const contract = await getContract()
    let res = await contract.endLottery(index)
    res = await res.wait()
    return res

  } catch (e) {
    console.log(e)
  }
}

export const startLottery = async (index, value) => {
  try {
    const contract = await getContract()
    let res = await contract.bid(index, {value: ethers.utils.parseEther(value)})
    res = await res.wait()
    return res

  } catch (e) {
    console.log(e)
  }
}

