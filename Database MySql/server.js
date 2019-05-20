const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const path = require('path');
const mysql = require('mysql');
const app = express();
const port = process.env.port || 2000;
const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'react_sql'
});

database.connect((error)=>{
    if(error) throw error;
    console.log('Connected...');
});

app.get('/build', (request, response)=>{
    response.sendFile(__dirname + '/public/views/buildDatabase.html');
});

app.post('/buildDatabase', urlencodedParser, (request, response)=>{
    response.write(`You created database name: "${request.body.databaseName}" successfully.\n`);
    response.end();
    let databaseName = request.body.databaseName;
    let sql = `CREATE DATABASE ${databaseName}`;
    database.query(sql, (error, result)=>{
        if(error) throw error;
        console.log(result);
    });
});

app.get('/create', (request, response)=>{
    response.sendFile(__dirname + '/public/views/createTable.html');
});

app.post('/createTable', urlencodedParser, (request, response)=>{
    response.write(`You created table name: "${request.body.tableName}" successfully.\n`);
    response.end();
    let tableName = request.body.tableName;
    let sql = `CREATE TABLE ${tableName}(ID int NOT NULL, Name VARCHAR(255), Developer VARCHAR(255), Publisher VARCHAR(255), Price int, PRIMARY KEY(ID))`;
    database.query(sql, (error, result)=>{
        if(error) throw error;
        console.log(result);
    });
});

app.get('/insert', (request, response)=>{
    response.sendFile(__dirname + '/public/views/insertData.html');
});

app.post('/insertData', urlencodedParser, (request, response)=>{
    response.write(`You selected table name :"${request.body.tableName}" to insert datas.\n`);
    response.write(`You inserted data name: "${request.body.gameID}" successfully.\n`);
    response.write(`You inserted data name: "${request.body.gameName}" successfully.\n`);
    response.write(`You inserted data name: "${request.body.gameDeveloper}" successfully.\n`);
    response.write(`You inserted data name: "${request.body.gamePublisher}" successfully.\n`);
    response.write(`You inserted data name: "${request.body.gamePrice}" successfully.\n`);
    response.end();
    let tableName = request.body.tableName;
    let id = request.body.gameID;
    let name = request.body.gameName;
    let developer = request.body.gameDeveloper;
    let publisher = request.body.gamePublisher;
    let price = request.body.gamePrice;
    let sql = `INSERT INTO ${tableName}(ID, Name, Developer, Publisher, Price) VALUES(${id}, '${name}', '${developer}', '${publisher}', ${price})`;
    database.query(sql, (error, result)=>{
        if(error) throw error;
        console.log(result);
    });
});

app.get('/select', (request, response)=>{
    response.sendFile(__dirname + '/public/views/selectData.html');
});

app.post('/selectData', urlencodedParser, (request, response)=>{
    let tableName = request.body.tableName;
    let sql = `SELECT * FROM ${tableName}`;
    database.query(sql, (error, rows, result)=>{
        if(error) throw error;
        response.send(rows);
        console.log(result);
    });
});

app.get('/update', (request, response)=>{
    response.sendFile(__dirname + '/public/views/updateData.html');
});

app.post('/updateData', urlencodedParser, (request, response)=>{
    response.write(`You selected table name: "${request.body.tableName}" to change data.\n`);
    response.write(`You selected column name: "${request.body.columnName}" to change data.\n`);
    response.write(`You updated data name to: "${request.body.updateData}".'\n`);
    response.end();
    let tableName = request.body.tableName;
    let columnName = request.body.columnName;
    let updateData = request.body.updateData;
    let sql = `UPDATE ${tableName} SET ${columnName} = ${updateData}`;
    database.query(sql, (error, result)=>{
        if(error) throw error;
        console.log(result);
    });
});

app.get('/drop', (request, response)=>{
    response.sendFile(__dirname + '/public/views/dropData.html');
});

app.post('/dropData', urlencodedParser, (request, response)=>{
    response.write(`You selected table name: "${request.body.tableName}" to drop data.\n`);
    response.write(`You dropped column name: "${request.body.columnName}".\n`);
    response.end();
    let tableName = request.body.tableName;
    let columnName = request.body.columnName;
    let sql = `ALTER TABLE ${tableName} DROP COLUMN ${columnName}`;
    database.query(sql, (error, result)=>{
        if(error) throw error;
        console.log(result);
    });
});

app.get('/add', (request, response)=>{
    response.sendFile(__dirname + '/public/views/addColumn.html');
});

app.post('/addColumn', urlencodedParser, (request, response)=>{
    response.write(`You selected table name: "${request.body.tableName}" to add column.\n`);
    response.write(`You added column name: "${request.body.columnName}" to ${request.body.tableName} database.\n`);
    response.write(`You selected type data: "${request.body.typeData}".\n`);
    response.end();
    let tableName = request.body.tableName;
    let columnName = request.body.columnName;
    let typeData = request.body.typeData;
    let sql = `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${typeData}`;
    database.query(sql, (error, result)=>{
        if(error) throw error;
        console.log(result);
    });
});

app.get('/delete', (request, response)=>{
    response.sendFile(__dirname + '/public/views/deleteTable.html');
});

app.post('/deleteTable', urlencodedParser, (request, response)=>{
    response.write(`You deleted table name: "${request.body.deleteName}".\n`);
    response.end();
    let deleteName = request.body.deleteName;
    let sql = `DROP TABLE ${deleteName}`;
    database.query(sql, (error, result)=>{
        if(error) throw error;
        console.log(result);
    });
});

app.get('/erase', (request, response)=>{
    response.sendFile(__dirname + '/public/views/eraseDatabase.html');
});

app.post('/eraseDatabase', urlencodedParser, (request, response)=>{
    response.write(`You deleted database name: "${request.body.databaseName}".\n`);
    response.end();
    let deleteName = request.body.databaseName;
    let sql = `DROP DATABASE ${deleteName}`;
    database.query(sql, (error, result)=>{
        if(error) throw error;
        console.log(result);
    });
});

app.listen(port, ()=>{
    console.log(`Server running at ${port}`);
});