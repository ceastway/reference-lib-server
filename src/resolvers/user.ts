import { Resolver, Arg, Ctx, Mutation, InputType, Field, ObjectType, Query } from "type-graphql";
import { MyContext } from "../types";
import { User } from "../entities/User";
import argon2 from "argon2";
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from "../constants";
import { PrimaryDataSource } from "../data-sources";
import { sendMail } from "../util/sendMail";
import {v4 as uuidv4} from "uuid";
import { FieldError } from "./common"
// import { FieldError, FieldErrorCommon } from "./common"

PrimaryDataSource.initialize();

// ## InputTypes are used for Arguments
@InputType()
class EmailUsernamePasswordInput {
    @Field()
    email: string
    @Field()
    username: string
    @Field()
    password: string
}

@InputType()
class UsernameOrEmailPasswordInput {
    @Field()
    username: string //or email
    @Field()
    password: string
}

@InputType()
class EmailInput {
    @Field()
    email: string //or email
}

// ## ObjectTypes are returned from mutations
@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => User, {nullable: true})
    user?: User;
}

// @ObjectType()
// export class FieldError {
//     @Field()
//     field: string;
//     @Field()
//     message: string;
// }

@Resolver()
export class UserResolver {

    @Query(() => User, {nullable: true})
    async me(
        @Ctx() { req }: MyContext
    ){
        //you are not logged in
        if(!req.session.userId){
            return null
        }

        // return User.findOne({where: {id:req.session.userId}});
        return await PrimaryDataSource
        .manager.findOne(User, {where: {id:req.session.userId}});
    }

    /*
    ForgotPassword Mutation
    */
    @Mutation(() => Boolean)
    async forgotPassword(
        // @Arg("email") email: string,
        @Arg('options') options: EmailInput,
        @Ctx() { req, res, redis }: MyContext) {
        
        console.log(req, res);
        //return await PrimaryDataSource.manager.find(User, {where: {id:req.session.userId}});
        const user = await PrimaryDataSource.manager.findOne(User, {where: [
            {email: options.email}
        ]});

        if(user){
            const token = uuidv4();
            await redis.set(FORGOT_PASSWORD_PREFIX + token, user.id, 'EX', 1000 * 60 * 24 * 2);
            await sendMail(options.email, "", "<a href='http://localhost:3000/reset-password/" + token +"'>Reset Your Password</a>");

            return true;
        }else{
            //the user is not in the database
            return true;
        }
    }

    /*
    Registration Mutation
    */
    @Mutation(() => UserResponse)
    async register( 
        @Arg("options") options: EmailUsernamePasswordInput,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse>{

        // console.log("req: ", req);
        if (options.username.length <= 2){
            return {
                errors: [{
                    field: 'username',
                    message: 'length must be more than 2 characters'
                }]
            };
        }

        if (options.password.length <= 3){
            return {
                errors: [{
                    field: 'password',
                    message: 'length must be more than 3 characters'
                }]
            };
        }
        
        const hashedPassword = await argon2.hash(options.password);

        try {

            // example using query builder
            /*
            const result = await PrimaryDataSource.manager
                .createQueryBuilder()
                .insert()
                .into(User)
                .values([
                    { email: options.email, username: options.username, password:  hashedPassword }
                ])
                .execute();
            */

            // example using data.manager insert
            /*
            const result = await PrimaryDataSource.manager.insert(User, [
                { email: options.email, username: options.username, password:  hashedPassword }
            ])

            user = await PrimaryDataSource.manager.findOne(User, {where:{id: result.raw.insertId}});
            */

            //example using user create
            const user = await User.create({ email: options.email, username: options.username, password:  hashedPassword }).save();

            if(user){
                req.session.userId = user.id;

                return {
                    user
                };
                
            }else{
                return {
                    errors: [{
                        field: 'username',
                        message: 'Problem with getting user after insert.'
                    }]
                };
            }
            
        } catch (err) {
            console.log(err);
            if(err.errno == 1062){
                // duplicate username exists
                return {
                    errors: [{
                        field: 'username',
                        message: 'This username or email address is already taken.  Please enter a different email/username.'
                    },{
                        field: 'email',
                        message: 'This username or email address is already taken.  Please enter a different email/username.'
                    }]
                };
            } else {
                return {
                    errors: [{
                        field: 'password',
                        message: 'An unknown error occured..'
                    }]
                };
            }
            
        }
        
    }


    /*
    Login Mutation
    */
    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernameOrEmailPasswordInput,
        @Ctx() { req }: MyContext): Promise<UserResponse | null> {
        
        const userArr = await PrimaryDataSource.manager.find(User, {where: [
                {username: options.username},
                {email: options.username}
            ]});

        console.log("req", req)
        // console.log("userArr",userArr);
        // console.log("id: ",userArr[0].id);
        // user = userArr[0];

        if (!userArr[0]) {
            return {
                errors: [{
                    field: 'username',
                    message: "that username doesn't exist",
                }]
            }
        }

        const valid = await argon2.verify(userArr[0].password, options.password);
        if (!valid){
            return {
                errors: [{
                    field: "password",
                    message: "incorrect password",
                }]
            }   
        }

        console.log("req.session.userId: ",userArr[0].id);

        //log user in
        req.session.userId = userArr[0].id;

        return {user: userArr[0]};
    }

    /*
    User Logout Mutation
    */
    @Mutation(() => Boolean)
    userLogout(
        @Ctx() { req, res }: MyContext) {
        return new Promise((resolve) => {
            req.session.destroy(err => {
                res.clearCookie(COOKIE_NAME);
                if (err) {
                    console.log("err:", err);
                    resolve(false);
                    return;
                }

                resolve(true);
            });
        });
    }

        /*
    Change Password Mutation
    */
    @Mutation(() => UserResponse)
    async changePassword(
        @Arg('newPassword') newPassword: string,
        @Arg('confirmPassword') confirmPassword: string,
        @Arg('token') token: string,
        @Ctx() { req, redis }: MyContext): Promise<UserResponse> {
        
        if (newPassword.length <= 3){
            return {
                errors: [{
                    field: 'newPassword',
                    message: 'length must be more than 3 characters'
                }]
            };
        }

        if (newPassword != confirmPassword){
            return {
                errors: [{
                    field: 'confirmPassword',
                    message: 'Your password confirmation does not match your new password.'
                }]
            };
        }

        const userId = await redis.get(FORGOT_PASSWORD_PREFIX + token);

        let UserIdNum;

        if(userId){
            UserIdNum = parseInt(userId);
        }else{
            return {
                errors: [{
                    field: "token",
                    message: "Token error"
                }]
            } 
        }
        
        const user = await PrimaryDataSource.manager.findOne(User, {where:{id: UserIdNum}});

        //find this user based on the token
        if(!user){
            return {
                errors: [{
                    field: "token",
                    message: "User Not found"
                }]
            } 
        }else{
            //update user's password
            await User.update({id: user.id}, {
                password: await argon2.hash( newPassword )
            })

            //delete the reset password token
            await redis.del(FORGOT_PASSWORD_PREFIX + token);

            //log user in
            req.session.userId = user.id;

            return {user: user}
        
        }

        
    }

}