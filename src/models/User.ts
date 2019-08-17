import bcrypt from "bcrypt";
import {
    prop, Typegoose, pre, staticMethod
} from 'typegoose';

@pre<UserSchema>("save", function (next) {
    let user = this;
    if (user.isModified("password") || user.isNew)
    {
        console.log(user.password)
        user.password = UserSchema.hashPassword(user.password);
        console.log(user.password)
    }
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
        return bcrypt.compareSync(password, hash) || false;
    }

    @staticMethod 
    public static hashPassword(password: string | undefined) : any {
        return bcrypt.hashSync(password, 10) || null;
    }
};

export const User = new UserSchema().getModelForClass(UserSchema, {
    schemaOptions: {
        timestamps: true,
        collection: "users"
    }
});