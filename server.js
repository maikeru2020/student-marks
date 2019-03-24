// general setup
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const bcrypt = require('bcrypt');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.set('views', 'views');
require('dotenv').config();

// postgres database connection
const {Pool} = require('pg');
const dbUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/elessonplan';
const pool = new Pool({connectionString: dbUrl});

// root redirects to sign in page
app.get('/', function(req, res) {
    res.redirect('sign_in.html');
});

// get marks data and render edit_marks.ejs
app.get('/editMarks', function(req, res) {
    var sql = 'SELECT m.score, t.task_name, t.max_score, m.student_id, s.first_name, s.last_name FROM marks m JOIN tasks t ON t.id = m.task_id JOIN students s ON s.id = m.student_id WHERE student_id = $1';
    values = [Number(req.query.student_id)];
    pool.query(sql, values, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            marks = result.rows;
            res.render('edit_marks', marks);
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
        });
    }
});

// insert new user in database
// called from create_account.html by admin account
app.post('/insertUser', function(req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var username = req.body.username;
    var password = req.body.password;
    var accountType = Number(req.body.accountType);
    
    // hash the password before inserting into database
    bcrypt.hash(password, 10, function(err, passwordHash) {
        if (err) {
            console.log(err);
        }
        var sql = 'INSERT INTO users(first_name, last_name, username, password_hash, account_type) VALUES ($1, $2, $3, $4, $5)'
        var values = [firstName, lastName, username, passwordHash, accountType];
        pool.query(sql, values, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                res.send(username + " inserted into database");
            }
        })
    });

})

// called from sign in page to validate user credentials
// redirect based on account type
app.post('/signIn', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    sql = 'SELECT id, password_hash, account_type FROM users WHERE username=$1';
    values = [username];
    pool.query(sql, values, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            rows = result.rows;
            if (rows.length > 0) {
                var userId = rows[0].id;
                var passwordHash = rows[0].password_hash;
                var accountType = rows[0].account_type;
                // make sure password matches hash
                bcrypt.compare(password, passwordHash, function(err, match) {
                    if (match) {
                        switch(accountType) {
                            // parent
                            case 1:
                                res.redirect('displayMarks?parentId=' + userId);
                                break;
                            // teacher    
                            case 2:
                                res.redirect('selectStudents?teacherId=' + userId);
                                break;
                            // admin
                            case 3:
                                res.redirect('create_account.html');
                        }
                    } else {
                        res.redirect('sign_in.html');
                    }
                });
            } else {
                res.redirect('sign_in.html');
            }
        }
    });
})

// get student info to create dropdown and render select_student.ejs
app.get('/selectStudents', function(req, res) {
    var teacherId = req.query.teacherId;
    var sql = 'SELECT s.id, s.first_name, s.last_name FROM students s JOIN student_teacher st ON s.id=st.student_id WHERE st.teacher_id=$1';
    var values = [teacherId];
    pool.query(sql, values, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            var students = result.rows;
            res.render('select_student', {students: result.rows});
        }
    });
})

// get marks data and render display_marks.ejs
app.get('/displayMarks', function(req, res) {
    var parentId = req.query.parentId;
    var sql = 'SELECT m.score, m.task_id, t.task_name, t.max_score, s.first_name, s.last_name FROM marks m JOIN tasks t ON t.id = m.task_id JOIN students s ON s.id = m.student_id JOIN student_parent sp ON s.id = sp.student_id WHERE sp.parent_id = $1 ORDER BY m.task_id';
    values = [Number(parentId)];
    pool.query(sql, values, function(err, result) {
        if (err) {
            console.log(err);
            res.end();
        } else {
            marks = result.rows;
            res.render('display_marks', marks);
        }
    });

});

app.listen(port, () => console.log("Connected on port " + port));