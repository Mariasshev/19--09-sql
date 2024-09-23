var express = require('express');
var app = express();
var fs = require('fs');
const querystring = require('querystring');
app.set('view engine', 'ejs');

var port = 8080;
var mssql = require('mssql');

var config = {
    server: 'LAPTOP-RPD6D51R\\SQLEXPRESS01',
    database: 'test',
    user: 'Maria',
    password: '12345',
    options: {
      encrypt: true,  // Использование SSL/TLS
      trustServerCertificate: true // Отключение проверки самоподписанного сертификата
    },
    port: 1433
}

mssql.connect(config, err =>{
    if(err){
        console.log('Error while connection', err)
    }
    else{
        console.log('Success connection!')
    }
})
app.get('/', (req, res) => {
    var path = 'html/' + 'welcome-page.html';

        fs.readFile(path, function(err, data){
            if(err){
                console.log(err);
                res.writeHead(404, { 'Content-Type' : 'text/html'});
                res.end('Not Found!');
            }
            else{
                res.writeHead(200, { 'Content-Type' : 'text/html'});
                res.write(data.toString());
                res.end();
            }
        })
})

app.get('/sign-in', (req, res) => {
    var path = 'html/' + 'sign-in.html';

        fs.readFile(path, function(err, data){
            if(err){
                console.log(err);
                res.writeHead(404, { 'Content-Type' : 'text/html'});
                res.end('Not Found!');
            }
            else{
                res.writeHead(200, { 'Content-Type' : 'text/html'});
                res.write(data.toString());
                res.end();
            }
        })
})

app.get('/submit-sign-in', (req, res) => {
    const login = req.query.login;
    const password = req.query.password;

    const request = new mssql.Request();
    request.input('login', mssql.VarChar, login);  
    request.input('password', mssql.VarChar, password);

    request.query('SELECT * FROM Users WHERE login=@login AND password=@password', (err, result) => {
        if (err) {
            console.error('Ошибка выполнения запроса:', err);
            res.status(500).send('Произошла ошибка при получении данных');
        } else {
            if (result.recordset.length === 1) {
                request.query('SELECT * FROM Users', (err, allUsers) => {
                    if (err) {
                        console.error('Ошибка получения всех пользователей:', err);
                        res.status(500).send('Произошла ошибка при получении данных');
                    } else {
                        res.render('users', { users: allUsers.recordset });
                    }
                });
            } else {
                res.sendFile(__dirname + '/html/about-us.html');
            }
        }
    });
});

app.get('/register', (req, res) => {
    var path = 'html/' + 'register.html';

        fs.readFile(path, function(err, data){
            if(err){
                console.log(err);
                res.writeHead(404, { 'Content-Type' : 'text/html'});
                res.end('Not Found!');
            }
            else{
                res.writeHead(200, { 'Content-Type' : 'text/html'});
                res.write(data.toString());
                res.end();
            }
        })
})


app.get('/submit-register', (req, res) => {
    const name = req.query.name;
    const login = req.query.login;
    const password = req.query.password;

    const request = new mssql.Request();
    request.input('name', mssql.VarChar, name); 
    request.input('login', mssql.VarChar, login);  
    request.input('password', mssql.NVarChar, password);

    request.query('SELECT * FROM Users WHERE name=@name AND login=@login AND password=@password', (err, result) => {
        if (err) {
            console.error('Ошибка выполнения запроса:', err);
            res.status(500).send('Произошла ошибка при получении данных');
        } else {
            if (result.recordset.length === 1) {
                request.query('SELECT * FROM Users', (err, allUsers) => {
                    if (err) {
                        console.error('Ошибка получения всех пользователей:', err);
                        res.status(500).send('Произошла ошибка при получении данных');
                    } else {
                        res.send('User already exists!');
                    }
                });
            } else {
                const query = `
                INSERT INTO Users (name, login, password) 
                VALUES (@name, @login, @password)
                `;

                request.query(query, (err, result) => {
                    if (err) {
                        console.error('Ошибка выполнения запроса:', err);
                        res.status(500).send('Ошибка при добавлении пользователя');
                    } else {
                        console.log('Пользователь добавлен');
                        res.send('Пользователь успешно добавлен');
                    }
                });
            }
        }
    });
});


app.listen(port, function() { 
	console.log('app listening on port ' + port); 
}); 

