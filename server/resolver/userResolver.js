import User from './../models/userModel.js'
import bycrpt from 'bcryptjs'

const userResolver = {
    Query: {
        authUser: async(_, _, context) => {
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
                if(!existingUser) {
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
                const { username, password } = input

                const { user } = await context.authenticate('graphql-local', { username, password})
                await context.login(user)
                return user
            } catch (err) {
                console.log('Error in Sign', err)
                throw new Error(err.message || 'Internal Server Error')
            }
        },
        logout: async(_, _, context) => {
            try {
                await context.logout();
                req.session.destroy(err => {
                    if(err) throw err
                })
                res.clearCookie('connect.sid')
                return ({ message: 'Logged out successfully'})
            } catch (err) {
                console.log('Error in Logout', err)
                throw new Error(err.message || 'Internal Server Error')
            }
        }
    }
}

export default userResolver;