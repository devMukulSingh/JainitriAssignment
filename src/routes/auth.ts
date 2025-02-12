import { Hono } from "hono";
import { authSchema } from "../schema/schema.js";

const authApp = new Hono();

authApp.post('/register',async(c) => {

    const body = await c.req.json();
    console.log(body);
    const parsedBody = authSchema.safeParse(body);
    if(!parsedBody.success){
        return c.json({
            "error":parsedBody.error.errors.map( err => err.message),
        },400)
    }

    


    return c.json("hello from auth")
})


export default authApp;