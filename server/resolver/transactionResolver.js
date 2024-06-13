import Transaction from './../models/transactionModel.js'
import User from '../models/userModel.js'

const transactionResolver = {
    Query: {
        transactions: async(_, __, context) => {
            try {
                if (!context.getUser()) throw new Error('Unauthorizedc')
                const userId = await context.getUser()._id
                const transactions = await Transaction.find({ 'userId': userId })
                return transactions
            } catch (err) {
                console.log('Error in transactions query', err)
                throw new Error(err.message || 'Internal Server Error')
            }
        },
        transaction: async(_, {transactionId}) => {
            try {
                const transaction = Transaction.findById(transactionId)
                return transaction
            } catch (err) {
                console.log('Error in transaction query', err)
                throw new Error(err.message || 'Internal Server Error')
            }
        },
        categoryStatistics: async(_, __, context) => {
            if(!context.getUser()) throw new Error('Unauthorized')

            const userId = context.getUser()
            const transactions = await Transaction.find({userId})
            const categoryMap = {}

            transactions.forEach((transaction) => {
                if(!categoryMap[transaction.category]) {
                    categoryMap[transaction.category] = 0
                }
                categoryMap[transaction.category] += transaction.amount
            })
            
            return Object.entries(categoryMap).map(([category, totalAmount]) => ({ category, totalAmount }))
        }
    },
    Mutation: {
        createTransaction: async(_, { input }, context) => {
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId: context.getUser()._id
                })

                await newTransaction.save(newTransaction)
                return newTransaction
            } catch (err) {
                console.log('Error in createTransaction', err)
                throw new Error(err.message || 'Internal Server Error')
            }
        },
        updateTransaction: async(_, { input }) => {
            try {
                const updateTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {new: true})
                return updateTransaction
            } catch (err) {
                console.log('Error in updateTransaction', err)
                throw new Error(err.message || 'Internal Server Error')
            }
        },
        deleteTransaction: async(_, {transactionId}) => {
            try {
                const deleteTransaction = await Transaction.findByIdAndDelete(transactionId)
                return deleteTransaction
            } catch (err) {
                console.log('Error in deleteTransaction', err)
                throw new Error(err.message || 'Internal Server Error')
            }
        }
    },
    Transaction: {
        user: async(parent) => {
            const userId = parent.userId
            try {
                const user = await User.findById(userId)
                return user
            } catch (err) {
                console.log("Error getting transction.user:", err)
                throw new Error("Error getting user")
            }
        }
    }
}

export default transactionResolver;