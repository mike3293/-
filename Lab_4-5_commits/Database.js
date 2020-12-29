let util = require('util');
let ee = require('events');

let db_data = [
    { id: 1, name: 'Иванов И.И', bday: '2001-01-01' },
    { id: 2, name: 'Петров П.П', bday: '2001-01-02' },
    { id: 3, name: 'Сидоров С.С', bday: '2001-01-03' },
];

function DB() {
    this.select = () => db_data;
    this.insert = (r) => db_data.push(r);
    this.update = (updateObj) => {
        let oldObject = db_data.find(m => m.id === updateObj.id);
        let newObj = db_data.splice(db_data.indexOf(oldObject), 1)[0];
        Object.keys(updateObj).forEach(field => {
            if (newObj[field]) {
                newObj[field] = updateObj[field];
            }
        });
        db_data.push(newObj);
        return newObj;
    };
    this.delete = (id) => {
        let oldObject = db_data.find(m => m.id == id);
        return db_data.splice(db_data.indexOf(oldObject), 1)[0];
    };
    this.commit = () => {
        console.log('commit');
    };
}

util.inherits(DB, ee.EventEmitter);

exports.DB = DB;
