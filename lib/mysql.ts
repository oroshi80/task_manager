import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || 'root', // Replace with your MySQL user
    password: process.env.MYSQL_PASS || '', // Replace with your MySQL password
    database: process.env.MYSQL_DB || 'kanban',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default db;
