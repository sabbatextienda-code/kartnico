import postgres from 'postgres'

const globalForDb = global as unknown as { 
  conn?: ReturnType<typeof postgres>
  url?: string
}

let sql: ReturnType<typeof postgres>

const dbUrl = process.env.DATABASE_URL!

if (process.env.NODE_ENV === 'production') {
  sql = postgres(dbUrl, {
    ssl: 'require',
    max: 10,
    idle_timeout: 20,
  })
} else {
  if (!globalForDb.conn || globalForDb.url !== dbUrl) {
    if (globalForDb.conn) {
      globalForDb.conn.end()
    }
    globalForDb.url = dbUrl
    globalForDb.conn = postgres(dbUrl, {
      ssl: 'require',
      max: 10,
      idle_timeout: 20,
    })
  }
  sql = globalForDb.conn
}

export { sql }
