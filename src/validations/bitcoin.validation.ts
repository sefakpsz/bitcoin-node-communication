import { createValidator } from 'express-joi-validation'
import Joi from 'joi'

export const validator = createValidator({ passError: true })

export const GetTransactions = Joi.object({
    network: Joi.string(),
    address: Joi.string(),
    count: Joi.number().required(),
    skip: Joi.number().required()
})

export const SendBitcoin = Joi.object({
    network: Joi.string(),
    to: Joi.string().required(),
    amount: Joi.number().required(),
    minConfirmation: Joi.number().required()
})

export const SetTxFee = Joi.object({
    network: Joi.string(),
    txFee: Joi.string().required()
})

export const GetTransaction = Joi.object({
    network: Joi.string(),
    txHash: Joi.string().required()
})

export const SetLabel = Joi.object({
    network: Joi.string(),
    address: Joi.string().required(),
    label: Joi.string().required()
})