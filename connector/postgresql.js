const { Pool } = require('pg')

// POSTGRES_USER = 'postgres'
// POSTGRES_HOST = 'localhost'
// POSTGRES_DB = 'gears-shop'
// POSTGRES_PWD = '123456'
// POSTGRES_PORT = '5432'

POSTGRES_USER = 'zdxgdoyqugsxdh'
POSTGRES_HOST = 'ec2-3-219-111-26.compute-1.amazonaws.com'
POSTGRES_DB = 'dfnnq1mk0jdp6a'
POSTGRES_PWD = 'af2744b3bd5d72a80b50ac27db50d8af3494449417522b563b602c1605324e68'
POSTGRES_PORT = '5432'

//postgres://zdxgdoyqugsxdh:af2744b3bd5d72a80b50ac27db50d8af3494449417522b563b602c1605324e68@ec2-3-219-111-26.compute-1.amazonaws.com:5432/dfnnq1mk0jdp6a


const pgConfig = {
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  password: POSTGRES_PWD,
  port: POSTGRES_PORT,
  ssl: true
}

const pool = new Pool(pgConfig)
/**
 *
 * @param {String} queryStr
 * @returns Object
 */

const query = async (queryStr) => {
  const client = await pool.connect()
  try {
    return await client.query(queryStr)
  } catch (error) {
    throw error
  } finally {
    client.release()
  }
}

module.exports.postgresql = {
  query,
}
