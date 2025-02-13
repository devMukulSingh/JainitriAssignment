import { Hono } from "hono";
import { diseaseSchema } from "../schema/schema.js";
import { prisma } from "../constants/constants.js";
import { Prisma } from "@prisma/client";

const diseaseApp = new Hono()

diseaseApp.post('/:userId/post-disease',async(c) => {

    const { userId } = c.req.param();

    const body = await c.req.json();

    const parsedBody = diseaseSchema.safeParse(body);
    
    if(!parsedBody.success){
        return c.json({
            error:parsedBody.error.errors.map(err => err.message)
        },400)
    }

    try{
        const newDisease = await prisma.disease.create({
            data:{
                userId,
                name:parsedBody.data.name,
            }
        })
        return c.json({
            msg:"disease created successfully",
            data:newDisease
        },201)
    }
    catch(e:any){
        console.log(e.message)
        if(e instanceof Prisma.PrismaClientKnownRequestError){
            if (e.code ==='P2003'){
                console.log(`User with userId doesnt exists`);
                return c.json({
                    error:"Unauthenticated"
                },403)
            }
        }
        return c.json({
            error:"Internal server error" + e
        },500)
    }
})


export default diseaseApp;