import axios from "axios"
import { Request, Response } from 'express'
import { ValidatedRequest } from "express-joi-validation"
import { GetTransactionsType } from "../types/bitcoin.types"
import { envSelector } from '../utils/functions/index'

export const createWallet = (req: Request, res: Response) => {
    const { network } = req.query

    const { url } = envSelector(network as string)
    if (!url)
        return res.json({ errorMessage: 'Invalid Network Type!' })

    axios.post(url as string, {
        "jsonrpc": "1.0",
        "id": "curltext",
        "method": "getnewaddress",
        "params": ["bech32"]
    }).then(result => {
        if (result.status === 200 && result.data.error === null) {
            return res.send({
                waddress: result.data.result,
                wprivate: "core"
            })
        } else {
            return res.status(result.status).send('Creation of Wallet Failed')
        }
    }).catch((err) => {
        return res.status(500).send(err)
    })
}

export const getAllTransactions = (req: ValidatedRequest<GetTransactionsType>, res: Response) => {
    const { network } = req.query

    const { url } = envSelector(network as string)
    if (!url)
        return res.json({ errorMessage: 'Invalid Network Type!' })

    let query = [req.query.address, req.query.count, req.query.skip]

    axios.post(url as string, {
        "jsonrpc": "1.0",
        "id": "curltext",
        "method": "listtransactions",
        "params": query
    }).then(result => {
        if (result.status === 200 && result.data.error === null) {
            return res.json({
                numberOfTransactions: result.data.result.length,
                transactions: result.data.result.reverse()
            })
        } else {
            return res.status(500).send({ message: "Getting Transactions Failed" })
        }
    }).catch((error) => {
        return res.status(500).send(error)
    })
}

export const getWalletBalance = (req: ValidatedRequest<GetTransactionsType>, res: Response) => {
    const { network } = req.query

    const { url } = envSelector(network as string)
    if (!url)
        return res.json({ errorMessage: 'Invalid Network Type!' })

    axios.post(url as string, {
        "jsonrpc": "1.0",
        "id": "curltext",
        "method": "getwalletinfo",
        "params": []
    }).then(result => {
        if (result.status === 200 && result.data.error === null) {
            return res.json({
                balance: result.data.result.balance
            })
        } else {
            return res.status(500).send({ message: "Getting Transactions Failed" })
        }
    }).catch((error) => {
        return res.status(500).send(error)
    })
}

export const sendBitcoin = async (req: Request, res: Response) => {
    const { network, to, amount, minConfirmation } = req.query

    const { url, passphrase } = envSelector(network as string)
    if (!url)
        return res.json({ errorMessage: 'Invalid Network Type!' })

    if (parseFloat(amount as string) <= 0.000001)
        return res.json({
            error: "Amount has to be greater than 0.000001"
        })

    let query = ["", { [to as string]: amount }, minConfirmation, "no comment"]
    const sendBitcoinBody = {
        "jsonrpc": "1.0",
        "id": "curltext",
        "method": "sendmany",
        "params": query,
    }

    // aşağıdaki 60 kaç saniye kilitsiz kalacağını belirler cüzdanın
    const walletUnlockBody = {
        "jsonrpc": "1.0",
        "id": "curltext",
        "method": "walletpassphrase",
        "params": [passphrase as string, 60],
    }

    const walletLockBody = {
        "jsonrpc": "1.0",
        "id": "curltext",
        "method": "walletlock",
        "params": [],
    }

    //unclocking wallet
    await axios.post
        (
            url as string,
            walletUnlockBody
        )
        .then(async () => {
            //sending bitcoin
            await axios.post
                (
                    url as string,
                    sendBitcoinBody
                )
                .then(async result => {
                    //locking wallet (if we do that it can do by itself but 30-40 seconds will has to be unlock that's why we do that manually)
                    await axios.post
                        (
                            url as string,
                            walletLockBody
                        )
                    return res.json({ txHash: result.data.result })
                })
                .catch((error) => {
                    return res.json(error)
                })
        }).catch((error) => {
            return res.json(error)
        })
}

//bakiye, kilitsiz kalacağı süre bilgisi, txFee,yapılan tx miktarı gibi bilgileri dönüyor
export const getWalletInfo = async (req: Request, res: Response) => {
    const { network } = req.query

    const { url } = envSelector(network as string)
    if (!url)
        return res.json({ errorMessage: 'Invalid Network Type!' })

    const body = {
        "jsonrpc": "1.0",
        "id": "curltext",
        "method": "getwalletinfo",
        "params": [],
    }

    await axios.post(
        url as string, body)
        .then((result) => {
            return res.json(result.data)
        }).catch((error) => {
            return res.json(error)
        })
}

//tx fee yi setliyoruz ana cüzdan için
export const setTxFee = async (req: Request, res: Response) => {
    const { network, txFee } = req.query

    const { url } = envSelector(network as string)
    if (!url)
        return res.json({ errorMessage: 'Invalid Network Type!' })

    const body = {
        "jsonrpc": "1.0",
        "id": "curltext",
        "method": "settxfee",
        "params": [txFee],
    }

    await axios.post(
        url as string, body)
        .then((result) => {
            return res.json(result.data)
        }).catch((error) => {
            return res.json(error)
        })
}

export const getTransaction = async (req: Request, res: Response) => {
    const { network, txHash } = req.query

    const { url } = envSelector(network as string)
    if (!url)
        return res.json({ errorMessage: 'Invalid Network Type!' })

    const body = {
        "jsonrpc": "1.0",
        "id": "curltext",
        "method": "gettransaction",
        "params": [txHash],
    }

    await axios.post(
        url as string, body)
        .then((result) => {
            return res.json(result.data)
        }).catch((error) => {
            return res.json(error)
        })
}

export const setLabel = async (req: Request, res: Response) => {
    const { network, address, label } = req.query

    const { url } = envSelector(network as string)
    if (!url)
        return res.json({ errorMessage: 'Invalid Network Type!' })

    const param = [address as string, label as string]

    const body = {
        "jsonrpc": "1.0",
        "id": "curltext",
        "method": "setlabel",
        "params": param,
    }

    await axios.post(
        url as string, body)
        .then((result) => {
            return res.json(result.data)
        }).catch((error) => {
            return res.json(error)
        })
}

export const estimateSmartFee = async (req: Request, res: Response) => {
    const { network } = req.query

    const { url } = envSelector(network as string)
    if (!url)
        return res.json({ errorMessage: 'Invalid Network Type!' })

    const body = {
        "jsonrpc": "1.0",
        "id": "curltext",
        "method": "estimatesmartfee",
        "params": [6],
    }

    await axios.post(
        url as string, body)
        .then((result) => {
            return res.json(result.data)
        }).catch((error) => {
            return res.json(error)
        })
}