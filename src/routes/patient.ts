import { Hono } from "hono";
import { patientSchema } from "../schema/schema.js";
import { prisma } from "../constants/constants.js";
import { Prisma } from "@prisma/client";

const patientApp = new Hono();

patientApp.post('/:userId/post-patient', async (c) => {
    const { userId } = c.req.param()
    const body = await c.req.json();
    const parsedBody = patientSchema.safeParse(body);
    if (!parsedBody.success) {
        return c.json({
            error: parsedBody.error.errors.map(err => err.message),
        }, 400)
    }
    const { diseaseIds, heartRate, name, phone } = parsedBody.data;
    // handle same phone no patient conflict
    try {
        const newPatient = await prisma.patient.create({
            data: {
                phone,
                name,
                heartRateDetails: {
                    create: {
                        value: heartRate
                    },
                },
                diseases: {
                    connect: diseaseIds
                },
                userId
            }
        })
        return c.json({
            msg: "Patient added successfully",
            newPatient
        }, 201)
    }
    catch (e: any) {
        console.log(e.message);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2003') {
                return c.json({
                    error: "User with particular userId doesnt exists"
                }, 400)
            }
            if (e.code ==='P2002'){
                return c.json({
                    error: "A patient with the given phone number already exists"
                }, 409)
            }
        }
        return c.json({
            error: "Internal server error" + e
        }, 500)
    }
})

patientApp.get('/:userId/get-patients', async (c) => {
    const params = c.req.param()
    const parsedPrams = patientSchema.pick({ userId: true }).safeParse(params);
    if (!parsedPrams.success) {
        return c.json({
            error: parsedPrams.error.errors.map(err => err.message),
        }, 400)
    }
    const { userId } = parsedPrams.data;
    try {
        const patients = await prisma.patient.findMany({
            where: {
                userId
            }
        })
        return c.json({
            data: patients
        }, 200)
    }
    catch (e: any) {
        console.log(e.message);
        return c.json({
            error: "Internal server error"
        }, 500)
    }
})

patientApp.get('/:userId/get-patient/:phone', async (c) => {
    const params = c.req.param();
    const parsedParams = patientSchema.pick({ userId: true,phone:true }).safeParse(params);
    if (!parsedParams.success) {
        return c.json({
            error: parsedParams.error.errors.map(err => err.message),
        }, 400)
    }
    const { userId,phone } = parsedParams.data;
    try {
        const patient = await prisma.patient.findMany({
            where: {
                phone,
                userId
            }
        })
        return c.json({
            data: patient
        }, 200)
    }
    catch (e: any) {
        console.log(e.message);
        return c.json({
            error: "Internal server error"
        }, 500)
    }
})
export default patientApp