import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import authApp from './routes/auth.js'
import patientApp from './routes/patient.js'
import diseaseApp from './routes/disease.js'

const app = new Hono().basePath('/api/v1');


app.use('/api/*', cors())
//TODO : had to add authentication
app.use(logger())

app.route('/auth',authApp)

app.route('/patient',patientApp)

app.route('/disease',diseaseApp)

const port =  8000;

console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
