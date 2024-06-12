import Transaction from './../models/transactionModel.js'

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
                console.log(transaction)
                return transaction
            } catch (err) {
                console.log('Error in transaction query', err)
                throw new Error(err.message || 'Internal Server Error')
            }
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
    }
}

export default transactionResolver;