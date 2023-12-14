import { Router } from 'express'

import { createWallet, getTransaction, getAllTransactions, getWalletInfo, sendBitcoin, setTxFee, getWalletBalance, setLabel, estimateSmartFee } from '../controllers/bitcoin.controller'

const router = Router()

import { validator, GetTransactions, SendBitcoin, SetTxFee, GetTransaction, SetLabel } from '../validations/bitcoin.validation'

router.get('/createWallet', createWallet)

router.get('/getAllTransactions', validator.query(GetTransactions), getAllTransactions)

router.get('/getWalletBalance', getWalletBalance)

router.post('/sendBitcoin', validator.query(SendBitcoin), sendBitcoin)

router.get('/getWalletInfo', getWalletInfo)

router.post('/setTransactionFee', validator.query(SetTxFee), setTxFee)

router.get('/getTransaction', validator.query(GetTransaction), getTransaction)

router.post('/setLabel', validator.query(SetLabel), setLabel)

router.get('/estimateSmartFee', estimateSmartFee)

export default router