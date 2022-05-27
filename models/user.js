const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required:[ true, 'Please enter an email'],
            unique: true,
            lowercase: true,
            validate: [isEmail, 'Please enter a valid email']
        },
        password:{
            type: String,
            required:[ true, 'Please enter a password'],
            minLength:[ 6, 'Minimum length is 6 characters']
        }
    })

//userSchema.post('save', function (doc, next) {
    //console.log('new user was created and saved', doc);
    //next();
//})
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    //console.log('new user about to be created and saved', this);
    next();
})


userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('Incorrect password');
    }
    throw Error('User not found');
};

    const User = mongoose.model('user', userSchema);

    module.exports = User;