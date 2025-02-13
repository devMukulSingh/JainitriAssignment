import { Hono } from "hono";
import { authSchema } from "../schema/schema.js";
import { prisma } from "../constants/constants.js";
import bcrypt from "bcrypt"
import { sign } from "hono/jwt";
import { Prisma } from "@prisma/client";

const authApp = new Hono();

authApp.post('/register', async (c) => {
    const body = await c.req.json();
    const parsedBody = authSchema.safeParse(body);
    if (!parsedBody.success) {
        return c.json({
            "error": parsedBody.error.errors.map(err => err.message),
        }, 400)
    }
    const { email, name, password } = parsedBody.data

    const payload = {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Token expires in 5 minutes
    }
    const secret = process.env.JWT_SECRET;
    const token = await sign(payload, secret as string)
    const hashedPassword = await bcrypt.hash(password, 12)
    try {
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
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                token
            }
        }, 201)
    }
    catch (e: any) {
        console.log(e.message);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                return c.json({
                    error: "user already exists"
                }, 409)
            }
        }
        return c.json({
            error: "Internal server error"
        }, 500)
    }

})
//////////////////////////////////////////////////////////////////////////////
authApp.post('/login', async (c) => {
    const body = await c.req.json();
    const parsedBody = authSchema.omit({ name: true }).safeParse(body);
    if (!parsedBody.success) {
        return c.json({
            "error": parsedBody.error.errors.map(err => err.message),
        }, 400)
    }
    const { email, password } = parsedBody.data

    const payload = {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    }
    const secret = process.env.JWT_SECRET;
    const token = await sign(payload, secret as string)
    try {
        const user = await prisma.user.findFirst({
            where: {
                email,
            }
        })
        if (!user) {
            return c.json({
                error: "Invalid credentials",
            }, 401)
        }
        if (!(await bcrypt.compare(password, user.password))) {
            return c.json({
                error: "Invalid credentials",
            }, 401)
        }
        return c.json({
            msg: "User loggedin successfully",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                token
            }
        }, 200)
    }
    catch (e:any) {
        console.log(e.message);
        return c.json({
            error: "Internal server error"
        }, 500)
    }

})



export default authApp;