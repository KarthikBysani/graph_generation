const db=requier('../config/db');
//get all users
const getAllUsers=async()=>{
    const [rows]=await db.query('SELECT * FROM users');
    return rows;
};