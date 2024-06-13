import User from './../models/userModel.js'
import Transaction from './../models/transactionModel.js'
import bycrpt from 'bcryptjs'

const userResolver = {
    Query: {
        authUser: async(_, __, context) => {
            try {
                const user = await context.getUser()
                return user
            } catch (err) {
                console.log('Error in authUser', err)
                throw new Error(err.message || 'Internal Server Error')
            }
        },
        user: async(_, { userId }) => {
            try {
                const user = User.findById(userId)
                return user
            } catch (err) {
                console.log('Error in user query', err)
                throw new Error(err.message || 'Internal Server Error')
            }
        }
    },
    Mutation: {
        signUp: async(_, { input }, context) => {
            try {
                const { username, password, name, gender } = input
                const existingUser = await User.findOne({ username })
                console.log(existingUser);
                if(existingUser) {
                    throw new Error('User already exist')
                }
                const salt = await bycrpt.genSalt(10)
                const hashedPassword = await bycrpt.hash(password, salt)

                const user = new User({
                    username,
                    password: hashedPassword,
                    name,
                    gender,
                    profilePicture: gender === 'male' ? `https://avatar.iran.liara.run/public/boy?username=${username}` : `https://avatar.iran.liara.run/public/girl?username=${username}`
                })

                await user.save()
                await context.login(user)
                return user;
            } catch (err) {
                console.log('Error in Sign', err)
                throw new Error(err.message || 'Internal Server Error')
            }
        },
        login: async(_, { input }, context) => {
            try {
                const { username, password } = input;
				if (!username || !password) throw new Error("All fields are required");
				const { user } = await context.authenticate("graphql-local", { username, password });

				await context.login(user);
				return user;
            } catch (err) {
                console.log('Error in Sign', err)
                throw new Error(err.message || 'Internal Server Error')
            }
        },
        logout: async(_, __, context) => {
            try {
                await context.logout();
                context.req.session.destroy(err => {
                    if(err) throw err
                })
                context.res.clearCookie('connect.sid')
                return ({ message: 'Logged out successfully'})
            } catch (err) {
                console.log('Error in Logout', err)
                throw new Error(err.message || 'Internal Server Error')
            }
        }
    },
    User: {
        transactions: async (parent) => {
            try {
                const transactions = await Transaction.find({ userId: parent._id });
                return transactions;
            } catch (err) {
                console.log("Error in user.transactions resolver: ", err);
                throw new Error(err.message || "Internal server error");
            }
        },
    }
}

export default userResolver;