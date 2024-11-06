const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Replace with your MySQL user
    password: '',  // Replace with your MySQL password
    database: 'crud' // Replace with your database name
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database: ", err);
        return;
    }
    console.log("Connected to MySQL database.");
});

// Route to fetch students from the "student" table
app.get("/", (req, res) => {
    const sql = "SELECT * FROM student";
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error executing SQL query: ", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(data); // Send the result as a JSON response
    });
});

app.post('/student',(req,res)=>{
    const sql="INSERT INTO student(`name`,`email`,`address`) VALUES(?)";
    console.log(req.body);
    const values =[
        req.body.name,
        req.body.email,
        req.body.address
    ]
    db.query(sql,[values], (err,result)=>{
        if(err) return res.json(err);
        return res.json (result);
    })
})

app.get('/read/:id', (req, res) => {
    const sql = "SELECT * FROM student WHERE ID = ?";
    const id =req.params.id;

    db.query(sql,[id], (err, result) => {
        if (err) {
            console.error("Error executing SQL query: ", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(result[0]); // Send the result as a JSON response
    });
});

app.put('/update/:id', (req, res) => {
    const sql = 'UPDATE student SET `name` = ?, `email` = ?, `address` = ? WHERE ID = ?';
    const id = req.params.id;
    
    db.query(sql, [req.body.name, req.body.email, req.body.address, id], (err, result) => {
        if (err) return res.json({ Message: "Error inside server" });
        return res.json(result[0]);
    });
});

app.delete('/delete/:id', (req, res) => {
    const sql = "DELETE FROM student WHERE ID =?";
    const id = req.params.id;
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.json({ Message: "Error inside server" });
        return res.json(result);
    });
});

// Start the server
app.listen(8081, () => {
    console.log("Server is running on port 8081");
});