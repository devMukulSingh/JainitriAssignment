import { Hono } from "hono";
import { authSchema } from "../schema/schema.js";
import { prisma } from "../constants/constants.js";
import bcrypt from "bcrypt"
import { sign } from "hono/jwt";

const authApp = new Hono();

authApp.post('/register', async (c) => {
    try {
        const body = await c.req.json();
        console.log(body);
        const parsedBody = authSchema.safeParse(body);
        if (!parsedBody.success) {
            return c.json({
                "error": parsedBody.error.errors.map(err => err.message),
            }, 400)
        }
        const { email, name, password } = parsedBody.data
        //if user already exists

        const existingUser = await prisma.user.findFirst({
            where: {
                email: email,
            }
        })
        if (existingUser) {
            return c.json({
                "error": "user already exists"
            }, 400)
        }
        const payload = {
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Token expires in 5 minutes
        }
        const secret = process.env.JWT_SECRET;
        const token = await sign(payload, secret as string)
        const hashedPassword = await bcrypt.hash(password, 12)
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            }
        })
        return c.json({
            msg: "User created successfully",
            data: {
                ...newUser,
                token
            }
        }, 201)
    }
    catch (e) {
        console.log(e);
        return c.json({
            error: "Internal server error"
        }, 500)
    }

})


export default authApp;