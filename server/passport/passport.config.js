import passport from 'passport'
import bcrypt from 'bcryptjs'
import { GraphQLLocalStrategy } from "graphql-passport";
import User from './../models/userModel.js'


export const configurePassport = async () => {
    passport.serializeUser((user, done) => {
        console.log('Serializing User')
        done(null, user.id)
    });

    passport.deserializeUser(async (id, done) => {
        console.log('Deserialize User')
        try {
            const user = await User.findById(id)
            done(null, user)
        } catch (err) {
            console.log(err)
            done(err)
        }
    });

    passport.use(
        new GraphQLLocalStrategy(async (username, password, done) => {
            try {
                const user = await User.findOne({ username });
                if(!user) {
                    throw new Error('Invalid username or password');
                }
                const validPassword = await bcrypt.compare(password, user.passport);
                if(!validPassword) {
                    throw new Error('Invalid username or password');
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        })
    )

    passport.use(
		new GraphQLLocalStrategy(async (username, password, done) => {
			try {
				const user = await User.findOne({ username });
				if (!user) {
					throw new Error("Invalid username or password");
				}
				const validPassword = await bcrypt.compare(password, user.password);

				if (!validPassword) {
					throw new Error("Invalid username or password");
				}

				return done(null, user);
			} catch (err) {
				return done(err);
			}
		})
	);
}