// general setup
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', 'views');

// postgres database connection
const {Pool} = require('pg');
const dbUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/elessonplan';
const pool = new Pool({connectionString: dbUrl});

// root redirects to select.ejs
app.get('/', function(req, res) {
    var sql = 'SELECT * FROM students';
    pool.query(sql, function(err, result) {
        if (err) {
            console.error(err);
        } else {
            students = result.rows;
            res.render('select', students);
        }
    });
})

// get marks data and render marks editing page (edit.ejs)
app.get('/editMarks', function(req, res) {
    var sql = 'SELECT m.score, t.task_name, t.max_score, m.student_id, s.first_name, s.last_name FROM marks m JOIN tasks t ON t.id = m.task_id JOIN students s ON s.id = m.student_id WHERE student_id = $1';
    values = [req.query.student_id];
    pool.query(sql, values, function(err, result) {
        if (err) {
            console.error(err);
        } else {
            marks = result.rows;
            res.render('edit', marks);
        }
    });
})

// update marks data in database
// called from client AJAX on editing page when the SAVE button is clicked
app.get('/updateMarks', function(req, res) {
    marks = req.query.marks;
    studentId = marks[0];
    var numFinished = 0;
    for (let i = 1; i < marks.length; i++) {
        sql = 'UPDATE marks SET score=$1 WHERE student_id=' + studentId + ' AND task_id=' + i;
        values = [marks[i]];
        pool.query(sql, values, function(err, result) {
            ++numFinished;
            if (numFinished == 5) {
                res.send('done');
            }
        })
    }
});
app.listen(port, () => console.log("Connected on port " + port));