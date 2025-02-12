import { Hono } from "hono";
import { diseaseSchema } from "../schema/schema.js";
import { prisma } from "../constants/constants.js";

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
    catch(e){
        console.log(e)
        return c.json({
            msg:"Disease added successfully"
        },201)
    }
})


export default diseaseApp;