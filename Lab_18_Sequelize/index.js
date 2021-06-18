let http = require('http');
let url = require('url');
let Sequelize = require('sequelize');
let config = require('./config').config;
let sequelize = new Sequelize(config);
let db = require('./db').ORM(sequelize);
let fs = require('fs');

// sequelize.authenticate()
//     .then(() => {
//         return sequelize.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED })
//             .then(t => {
//                 return db.Pulpit.create({ pulpit: 'test', pulpit_name: 'test', faculty: 'Some' }, { transaction: t })
//                     .then((r) => {
//                         setTimeout(() => {
//                             console.log('rollback', r);
//                             return t.rollback();
//                         }, 10000);
//                     });
//             });
//     });

let GET_handler = (req, res) => {
    let path_mas = url.parse(req.url).pathname.split('/');
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

    if (path_mas[1] === 'api') {
        switch (path_mas[2]) {
            case 'faculties':
                if (path_mas[3]) {
                    switch (path_mas[4]) {
                        case 'pulpits':
                            sequelize.authenticate().then(() => {
                                db.Faculty.findOne({
                                    include: [{
                                        model: db.Pulpit,
                                        as: 'faculty_pulpits',
                                        where: { faculty: decodeURIComponent(path_mas[3]) },
                                    }],
                                }).then(faculty => res.end(JSON.stringify(faculty)));
                            });
                            break;
                        case 'teachers':
                            sequelize.authenticate().then(() => {
                                db.Faculty.findOne({
                                    include: [{
                                        model: db.Pulpit,
                                        as: 'faculty_pulpits',
                                        where: { faculty: decodeURIComponent(path_mas[3]) },
                                        include: [{
                                            model: db.Teacher,
                                            as: 'pulpit_teachers',
                                        }],
                                    }],
                                }).then(faculty => res.end(JSON.stringify(faculty)));
                            });
                            break;
                        default:
                            break;
                    }
                } else {
                    sequelize.authenticate().then(() => {
                        db.Faculty.findAll().then(faculties => res.end(JSON.stringify(faculties)));
                    });
                }
                break;
            case 'pulpits':
                sequelize.authenticate().then(() => {
                    db.Pulpit.findAll().then(faculties => res.end(JSON.stringify(faculties)));
                });
                break;
            case 'subjects':
                sequelize.authenticate().then(() => {
                    db.Subject.findAll().then(faculties => res.end(JSON.stringify(faculties)));
                });
                break;
            case 'auditoriumstypes':
                sequelize.authenticate().then(() => {
                    db.Auditorium_type.findAll().then(faculties => res.end(JSON.stringify(faculties)));
                });
                break;
            case 'auditoriums':
                sequelize.authenticate().then(() => {
                    db.Auditorium.findAll().then(faculties => res.end(JSON.stringify(faculties)));
                });
                break;
            case 'auditoriumsgt60':
                sequelize.authenticate().then(async () => {
                    await db.Auditorium.scope('auditoriumsHigher60').findAll()
                        .then(count => res.end(JSON.stringify({ 'rows': count })))
                        .catch((err) => {
                            console.log(err);
                            Error400(res, err.toString());
                        });
                });
                break;
            default:
                break;
        }
    } else if (url.parse(req.url).pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        let page = fs.readFileSync('./index.html');
        res.end(page);
    }
};

let POST_handler = (req, res) => {
    let data_json = '';
    let path_mas = url.parse(req.url).pathname.split('/');
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    if (path_mas[1] === 'api') {
        switch (path_mas[2]) {
            case 'faculties':
                req.on('data', chunk => {
                    data_json += chunk;
                });
                req.on('end', () => {
                    data_json = JSON.parse(data_json);
                    sequelize.authenticate().then(() => {
                        db.Faculty.create({ faculty: data_json.faculty, faculty_name: data_json.faculty_name })
                            .then(faculty => res.end(JSON.stringify(faculty)))
                            .catch((err) => {
                                console.log(err);
                                Error400(res, err.toString());
                            });
                    });
                });
                break;
            case 'pulpits':
                req.on('data', chunk => {
                    data_json += chunk;
                });
                req.on('end', () => {
                    data_json = JSON.parse(data_json);
                    sequelize.authenticate().then(() => {
                        db.Pulpit.create({
                                pulpit: data_json.pulpit,
                                pulpit_name: data_json.pulpit_name,
                                faculty: data_json.faculty,
                            })
                            .then(pulpit => res.end(JSON.stringify(pulpit)))
                            .catch((err) => {
                                console.log(err);
                                Error400(res, err.toString());
                            });
                    });
                });
                break;
            case 'subjects':
                req.on('data', chunk => {
                    data_json += chunk;
                });
                req.on('end', () => {
                    data_json = JSON.parse(data_json);
                    sequelize.authenticate().then(() => {
                        db.Subject.create({
                                subject: data_json.subject,
                                subject_name: data_json.subject_name,
                                pulpit: data_json.pulpit,
                            })
                            .then(subject => res.end(JSON.stringify(subject)))
                            .catch((err) => {
                                console.log(err);
                                Error400(res, err.toString());
                            });
                    });
                });
                break;
            case 'auditoriumstypes':
                req.on('data', chunk => {
                    data_json += chunk;
                });
                req.on('end', () => {
                    data_json = JSON.parse(data_json);
                    sequelize.authenticate().then(() => {
                        db.Auditorium_type.create({
                                auditorium_type: data_json.auditorium_type,
                                auditorium_typename: data_json.auditorium_typename,
                            })
                            .then(subject => res.end(JSON.stringify(subject)))
                            .catch((err) => {
                                console.log(err);
                                Error400(res, err.toString());
                            });
                    });
                });
                break;
            case 'auditoriums':
                req.on('data', chunk => {
                    data_json += chunk;
                });
                req.on('end', () => {
                    data_json = JSON.parse(data_json);
                    sequelize.authenticate().then(() => {
                        db.Auditorium.create({
                                auditorium: data_json.auditorium,
                                auditorium_name: data_json.auditorium_name,
                                auditorium_capacity: data_json.auditorium_capacity,
                                auditorium_type: data_json.auditorium_type,
                            })
                            .then(subject => res.end(JSON.stringify(subject)))
                            .catch((err) => {
                                console.log(err);
                                Error400(res, err.toString());
                            });
                    });
                });
                break;
            default:
                break;
        }
    }
};

let PUT_handler = (req, res) => {
    let data_json = '';
    let path_mas = url.parse(req.url).pathname.split('/');
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    if (path_mas[1] === 'api') {
        switch (path_mas[2]) {
            case 'faculties':
                req.on('data', chunk => {
                    data_json += chunk;
                });
                req.on('end', () => {
                    data_json = JSON.parse(data_json);
                    sequelize.authenticate().then(() => {
                        db.Faculty.update({ faculty_name: data_json.faculty_name }, { where: { faculty: data_json.faculty } })
                            .then(count => res.end(JSON.stringify({ updated_rows: count[0] })))
                            .catch((err) => {
                                console.log(err);
                                Error400(res, err.toString());
                            });
                    });
                });
                break;
            case 'pulpits':
                req.on('data', chunk => {
                    data_json += chunk;
                });
                req.on('end', () => {
                    data_json = JSON.parse(data_json);
                    sequelize.authenticate().then(() => {
                        db.Pulpit.update({
                                pulpit_name: data_json.pulpit_name,
                                faculty: data_json.faculty,
                            }, { where: { pulpit: data_json.pulpit } })
                            .then(count => res.end(JSON.stringify({ updated_rows: count[0] })))
                            .catch((err) => {
                                console.log(err);
                                Error400(res, err.toString());
                            });
                    });
                });
                break;
            case 'subjects':
                req.on('data', chunk => {
                    data_json += chunk;
                });
                req.on('end', () => {
                    data_json = JSON.parse(data_json);
                    sequelize.authenticate().then(() => {
                        db.Subject.update({
                                subject_name: data_json.subject_name,
                                pulpit: data_json.pulpit,
                            }, { where: { subject: data_json.subject } })
                            .then(count => res.end(JSON.stringify({ updated_rows: count[0] })))
                            .catch((err) => {
                                console.log(err);
                                Error400(res, err.toString());
                            });
                    });
                });
                break;
            case 'auditoriumstypes':
                req.on('data', chunk => {
                    data_json += chunk;
                });
                req.on('end', () => {
                    data_json = JSON.parse(data_json);
                    sequelize.authenticate().then(() => {
                        db.Auditorium_type.update({ auditorium_typename: data_json.auditorium_typename }, { where: { auditorium_type: data_json.auditorium_type } })
                            .then(count => res.end(JSON.stringify({ updated_rows: count[0] })))
                            .catch((err) => {
                                console.log(err);
                                Error400(res, err.toString());
                            });
                    });
                });
                break;
            case 'auditoriums':
                req.on('data', chunk => {
                    data_json += chunk;
                });
                req.on('end', () => {
                    data_json = JSON.parse(data_json);
                    sequelize.authenticate().then(() => {
                        db.Auditorium.update({
                                auditorium_name: data_json.auditorium_name,
                                auditorium_capacity: data_json.auditorium_capacity,
                                auditorium_type: data_json.auditorium_type,
                            }, { where: { auditorium: data_json.auditorium } })
                            .then(count => res.end(JSON.stringify({ updated_rows: count[0] })))
                            .catch((err) => {
                                console.log(err);
                                Error400(res, err.toString());
                            });
                    });
                });
                break;
            default:
                break;
        }
    }
};

let DELETE_handler = (req, res) => {
    let path_mas = url.parse(req.url).pathname.split('/');
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    if (path_mas.length <= 2)
        Error400(res, 'Element number not specified');
    path_mas[3] = decodeURIComponent(path_mas[3]);
    if (path_mas[1] === 'api') {
        switch (path_mas[2]) {
            case 'faculties':
                sequelize.authenticate().then(() => {
                    db.Faculty.destroy({ where: { faculty: path_mas[3] } })
                        .then(count => res.end(JSON.stringify({ 'rows deleted': count })))
                        .catch((err) => {
                            console.log(err);
                            Error400(res, err.toString());
                        });
                });
                break;
            case 'pulpits':
                sequelize.authenticate().then(() => {
                    db.Pulpit.destroy({ where: { pulpit: path_mas[3] } })
                        .then(count => res.end(JSON.stringify({ 'rows deleted': count })))
                        .catch((err) => {
                            console.log(err);
                            Error400(res, err.toString());
                        });
                });
                break;
            case 'subjects':
                sequelize.authenticate().then(() => {
                    db.Subject.destroy({ where: { subject: path_mas[3] } })
                        .then(count => res.end(JSON.stringify({ 'rows deleted': count })))
                        .catch((err) => {
                            console.log(err);
                            Error400(res, err.toString());
                        });
                });
                break;
            case 'auditoriumstypes':
                sequelize.authenticate().then(() => {
                    db.Auditorium_type.destroy({ where: { auditorium_type: path_mas[3] } })
                        .then(count => res.end(JSON.stringify({ 'rows deleted': count })))
                        .catch((err) => {
                            console.log(err);
                            Error400(res, err.toString());
                        });
                });
                break;
            case 'auditoriums':
                sequelize.authenticate().then(() => {
                    db.Auditorium.destroy({ where: { auditorium: path_mas[3] } })
                        .then(count => res.end(JSON.stringify({ 'rows deleted': count })))
                        .catch((err) => {
                            console.log(err);
                            Error400(res, err.toString());
                        });
                });
                break;
            default:
                break;
        }
    }
};

let http_handler = (req, res) => {
    switch (req.method) {
        case 'GET':
            GET_handler(req, res);
            break;
        case 'POST':
            POST_handler(req, res);
            break;
        case 'PUT':
            PUT_handler(req, res);
            break;
        case 'DELETE':
            DELETE_handler(req, res);
            break;
        default:
            break;
    }
};

let Error400 = (response, errMess) => {
    console.log(errMess);
    response.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(errMess);
};

let server = http.createServer();
server.listen(3000, () => {
    console.log('server.listen(3000)');
}).on('request', http_handler);
