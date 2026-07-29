import react from '@vitejs/plugin-react'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const financesFilePath = path.resolve(rootDir, 'src/data/finances.json')
const emptyFinancesData = {
  cards: [],
  tags: [],
  transactions: [],
}

async function ensureFinancesFile() {
  try {
    await fs.access(financesFilePath)
  } catch {
    await fs.mkdir(path.dirname(financesFilePath), { recursive: true })
    await fs.writeFile(financesFilePath, `${JSON.stringify(emptyFinancesData, null, 2)}\n`)
  }
}

function financesJsonPlugin(): Plugin {
  return {
    name: 'finances-json-api',
    configureServer(server) {
      server.middlewares.use('/api/finances', async (request, response, next) => {
        if (!request.url?.startsWith('/')) {
          next()

          return
        }

        response.setHeader('Content-Type', 'application/json')

        if (request.method === 'GET') {
          await ensureFinancesFile()
          const data = await fs.readFile(financesFilePath, 'utf-8')

          response.end(data)

          return
        }

        if (request.method === 'POST') {
          let body = ''

          request.on('data', (chunk: Buffer) => {
            body += chunk.toString()
          })

          request.on('end', async () => {
            try {
              const parsedData = JSON.parse(body) as unknown

              await ensureFinancesFile()
              await fs.writeFile(financesFilePath, `${JSON.stringify(parsedData, null, 2)}\n`)
              response.end(JSON.stringify(parsedData))
            } catch {
              response.statusCode = 400
              response.end(JSON.stringify({ message: 'Invalid finances payload.' }))
            }
          })

          return
        }

        response.statusCode = 405
        response.end(JSON.stringify({ message: 'Method not allowed.' }))
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), financesJsonPlugin()],
})
