import { providers, Contract } from 'ethers'
import { WrapperBuilder } from 'redstone-evm-connector'
import Lottery from '../../hardhat/artifacts/contracts/Lottery.sol/Lottery.json'
import { priceToWei } from './helpers'

export const contractAddress = '0x79Ef0E191bccE3CbD93110aB999414f0aD013081'

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
    const wrappedContract = WrapperBuilder
      .wrapLite(contract)
      .usingPriceFeed('redstone', { asset: 'ENTROPY' })

    // Provider should be authorized once after contract deployment
    // You should be the owner of the contract to authorize provider
    const result = await wrappedContract.authorizeProvider();

    if (result) {
      return await wrappedContract.createLottery(title, priceToWei(ticketPrice), endTime)
    }

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
console.log(lotteries)
    return lotteries

  } catch (e) {
    console.log(e)
  }
}

export const getParticipant = async () => {
  try {
    const contract = await getContract()
    const lotteryCount = await contract.getLotteryCount()

    let lotteries = []

    for (let i = 0; i < lotteryCount; i++) {
      const lottery = await contract.getParticipant(i)
      lotteries.push(lottery)
    }
    console.log(lotteries)
    return lotteries

  } catch (e) {
    console.log(e)
  }
}

export const enter = async (index, value) => {

  try {
    const contract = await getContract()
    let res = await contract.enter(index, {value})
    res = await res.wait()
    return res

  } catch (e) {
    console.log(e)
  }
}

export const endLottery = async index => {

  try {
    const contract = await getContract()

    const wrappedContract = WrapperBuilder
      .wrapLite(contract)
      .usingPriceFeed('redstone', { asset: 'ENTROPY' })

    await wrappedContract.authorizeProvider();

    let res = await wrappedContract.pickWinner(index)
    return await res.wait()


  } catch (e) {
    console.log(e)
  }
}

