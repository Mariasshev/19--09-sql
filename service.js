var express = require('express');
var app = express();
var fs = require('fs');
const querystring = require('querystring');

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
    //request.input('login', mssql.VarChar, login);  

    request.query('SELECT * FROM Users', (err, result) => {
        if (err) {
            console.error('Ошибка выполнения запроса:', err);
            res.status(500).send('Произошла ошибка при получении данных');
        } else {
            console.log(result.recordset);
            res.json(result.recordset);  
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

app.listen(port, function() { 
	console.log('app listening on port ' + port); 
}); 

