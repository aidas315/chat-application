import bcrypt from "bcrypt";
import {
    prop, Typegoose, pre, staticMethod
} from 'typegoose';

@pre<UserSchema>("save", function (next) {
    let user = this;
    if (!user.isModified("password")) return next();

    bcrypt.hash(user.password, 10, function (error, hash) {
        if (error) next(error);
        user.password = hash;
    });

    next();

})

class UserSchema extends Typegoose {
    @prop({ required: true })
        name?: string;
    @prop({ required: true, unique: true })
        email?: string;
    @prop({ required: true, unique: true })
        username?: string;
    @prop({ required: true })
        password?: string;
    @prop()
        friends?: UserSchema[];

    @staticMethod
    public static verifyPasswords(hash: any, password: string): Boolean {
        bcrypt.compare(password, hash, (error, res) => {
            return res;
        });
        return false;
    }
};

export const User = new UserSchema().getModelForClass(UserSchema, {
    schemaOptions: {
        timestamps: true
    }
});