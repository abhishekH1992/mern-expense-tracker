import { transactions } from './../../seeder/data.js'

const transactionResolver = {
    Query: {
        transactions: () => {
            return transactions
        }
    },
    Mutation: {}
}

export default transactionResolver;