import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import authApp from './routes/auth.js'

const app = new Hono().basePath('/api/v1');

app.use('/api/*', cors())

app.use(logger())

app.route('/auth',authApp)

const port = 8000;

console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
