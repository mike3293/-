const http = require('http');
const fs = require('fs');
const RPCWebSocket = require('rpc-websockets').Server;

const port = 3000;
const WS_PORT = 8001;
const HOST = 'localhost';
let error_count = 0;

const socket = new RPCWebSocket({
    port: WS_PORT,
    host: HOST,
    path: '/',
});
socket.event('changed');

let getStudents = (fullpath) => {
    return JSON.parse(fs.readFileSync(fullpath, 'utf8'));
};

let throwError = (res, message = 0, code = 404) => {
    res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: ++error_count, message }));
};

let deleteHandler = (req, res) => {
    let fullPath = './static/students.json';
    let sudentId = req.url.slice(1);
    if (!isNaN(sudentId)) {
        fs.access(fullPath, fs.constants.R_OK, (err) => {
            if (err) {
                console.log(err);
                throwError(res, `Ошибка чтения файла ${fullPath}`);
            } else {
                let students = getStudents(fullPath);
                const student = students.findIndex((stud) => stud.id === +sudentId);
                if (student > -1) {
                    const [studentToDel] = students.splice(students.indexOf(student), 1);
                    fs.writeFileSync(fullPath, JSON.stringify(students));
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    socket.emit('changed');
                    res.end(JSON.stringify(studentToDel));
                } else {
                    throwError(res, `Студент с id равным ${sudentId} не найден`);
                }
            }
        });
    } else if (req.url.includes('backup')) {
        let backs = [];
        fs.readdir('./backup/', function (err, items) {
            for (let i = 0; i < items.length; i++) {
                backs.push({ i: items[i] });
            }
        });
        setTimeout(() => {
            let path = req.url.replace('/backup/', '');
            let year = path.slice(0, 4);
            let month = path.slice(4, 6);
            let day = path.slice(6, 8);
            let toDelete = [];
            backs.forEach(function (item, i, arr) {
                let yearItem = item.i.slice(0, 4);
                let monthItem = item.i.slice(4, 6);
                let dayItem = item.i.slice(6, 8);
                if (parseInt(yearItem) > parseInt(year)) {
                    toDelete.push(item);
                } else {
                    if (parseInt(yearItem) === parseInt(year))
                        if (parseInt(monthItem) > parseInt(month)) {
                            toDelete.push(item);
                        } else {
                            if (
                                parseInt(month) === parseInt(monthItem) &&
                                parseInt(dayItem) > parseInt(day)
                            ) {
                                toDelete.push(item);
                            }
                        }
                }
            });
            toDelete.forEach(function (item, i, arr) {
                fs.unlinkSync('./backup/' + item.i);
            });
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(toDelete));
        }, 100);
    }
};

let putHandler = (req, res) => {
    let fullPath = './static/students.json';
    switch (req.url) {
        case '/':
            let data_json = '';
            req.on('data', (chunk) => {
                data_json += chunk;
            });
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                fs.access(fullPath, fs.constants.R_OK, (err) => {
                    if (err) {
                        throwError(res);
                    } else {
                        let students = getStudents(fullPath);
                        let flag = false;
                        students.forEach((stud) => {
                            if (stud.id === +data_json.id) {
                                flag = true;
                                stud.name = data_json.name;
                                stud.bday = data_json.bday;
                                stud.speciality = data_json.speciality;
                            }
                        });
                        if (flag) {
                            fs.writeFileSync(fullPath, JSON.stringify(students));
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            socket.emit('changed');
                            res.end(JSON.stringify(data_json));
                        } else {
                            throwError(res, `Ошибка нет студента с id ${data_json.id}`);
                        }
                    }
                });
            });
            break;
        default:
            throwError(res, 'Invalid method', 405);
    }
};

let postHandler = (req, res) => {
    let fullPath = './static/students.json';
    switch (req.url) {
        case '/':
            let students = getStudents(fullPath);
            let data = '';
            req.on('data', (chunk) => {
                data += chunk;
            });
            req.on('end', () => {
                let student = JSON.parse(data);
                if (!students.find((stud) => stud.id === +student.id)) {
                    students.push(student);
                    fs.writeFileSync(fullPath, JSON.stringify(students));
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    socket.emit('changed');
                    res.end(JSON.stringify(student));
                } else {
                    throwError(res, `Студент с id ${student.id} уже существует`);
                }
            });
            break;
        case '/backup':
            setTimeout(() => {
                let cur = new Date();
                addZero = (n) => {
                    return (n < 10 ? '0' : '') + n;
                };
                let backupPath =
                    './backup/' +
                    addZero(cur.getFullYear()) +
                    addZero(cur.getMonth() + 1) +
                    addZero(cur.getDate()) +
                    addZero(cur.getHours()) +
                    addZero(cur.getMinutes()) +
                    addZero(cur.getSeconds()) +
                    '_student-list.json';
                fs.copyFile(fullPath, backupPath, (err) => {
                    if (err) {
                        throwError(res, err.message, 500);
                    } else {
                        res.end('Successfully backuped');
                    }
                });
            }, 2000);
            break;
        default:
            throwError(res, 'Invalid method', 405);
    }
};

let getHandler = (req, res) => {
    let fullPath = './static/students.json';
    switch (req.url) {
        case '/':
            fs.access(fullPath, fs.constants.R_OK, (err) => {
                if (err) {
                    throwError(res, `Ошибка чтения файла ${fullPath}`);
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'application/json; charset=utf-8',
                    });
                    fs.createReadStream(fullPath).pipe(res);
                }
            });
            break;
        case '/backup':
            let backs = [];
            fs.readdir('./backup/', function (err, items) {
                console.log(items);
                for (let i = 0; i < items.length; i++) {
                    let count = i.toString();
                    backs.push([count, items[i]]);
                }
            });
            setTimeout(() => {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8',
                });
                res.end(JSON.stringify(backs));
            }, 100);
            break;
        default:
            let sudentId = req.url.slice(1);
            if (!isNaN(sudentId)) {
                fs.access(fullPath, fs.constants.R_OK, (err) => {
                    if (err) {
                        console.log(err);
                        throwError(res, `Ошибка чтения файла ${fullPath}`);
                    } else {
                        let students = getStudents(fullPath);
                        let student = students.find((stud) => stud.id === +sudentId);
                        if (student) {
                            res.writeHead(200, {
                                'Content-Type': 'application/json; charset=utf-8',
                            });
                            res.end(JSON.stringify(student));
                        } else {
                            throwError(res, `Студент с id равным ${sudentId} не найден`);
                        }
                    }
                });
            }
    }
};

const requestHandler = (request, response) => {
    switch (request.method) {
        case 'GET':
            getHandler(request, response);
            break;
        case 'POST':
            postHandler(request, response);
            break;
        case 'PUT':
            putHandler(request, response);
            break;
        case 'DELETE':
            deleteHandler(request, response);
            break;
        default:
            break;
    }
};

const server = http.createServer(requestHandler);
server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }
    console.log(`server is listening on ${port}`);
});
