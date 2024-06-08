import mangoose from 'mangooes'

const userSchema = new mangoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        enum: ['male', 'female']
    }
}, { timestamp: true });

const User = mangoose.model("User", userSchema)

export default User