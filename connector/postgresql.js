const { Pool } = require('pg')

// POSTGRES_USER = 'postgres'
// POSTGRES_HOST = 'localhost'
// POSTGRES_DB = 'postgres'
// POSTGRES_PWD = '123456'
// POSTGRES_PORT = '5432'

POSTGRES_USER = 'toshulryguagnm'
POSTGRES_HOST = 'ec2-52-70-205-234.compute-1.amazonaws.com'
POSTGRES_DB = 'd3geh3gop5vmb8'
POSTGRES_PWD = '905f0c83c1295d12a1d3bd0cfe6003e8f9e080f2545a705d7990a166acfba486'
POSTGRES_PORT = '5432'

//postgres://yufvflhxcpvfgp:e3f6d097ceeec0a9630172a7c59156ffcb50c418dd9ab26dc4f1ce28103e4a0d@ec2-44-196-146-152.compute-1.amazonaws.com:5432/dsc1ubmbkprdf

// POSTGRES_USER = 'zdxgdoyqugsxdh'
// POSTGRES_HOST = 'ec2-3-219-111-26.compute-1.amazonaws.com'
// POSTGRES_DB = 'dfnnq1mk0jdp6a'
// POSTGRES_PWD = 'af2744b3bd5d72a80b50ac27db50d8af3494449417522b563b602c1605324e68'
// POSTGRES_PORT = '5432'

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

const query = async(queryStr) => {
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