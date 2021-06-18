const Sequelize = require('sequelize');
const config = require('../../db/config').config;
const sequelize = new Sequelize(config);
const db = require('../../db/db').ORM(sequelize);

exports.getAll = (req, res) => {
    sequelize.authenticate().then(() => {
        db.Faculty.findAll().then(faculties => res.json(faculties));
    });
};

exports.create = (req, res) => {
    sequelize.authenticate().then(() => {
        db.Faculty.create({ faculty: req.body.faculty, faculty_name: req.body.faculty_name })
            .then(faculty => res.json((faculty)))
            .catch((err) => {
                console.log(err);
            });
    });
};

exports.update = (req, res) => {
    sequelize.authenticate().then(() => {
        db.Faculty.update({ faculty_name: req.body.faculty_name }, { where: { faculty: req.body.faculty } })
            .then(count => res.json(({ updated_rows: count[0] })))
            .catch((err) => {
                console.log(err);
            });
    });
};

exports.delete = (req, res) => {
    db.Faculty.destroy({
            where: { faculty: req.params.faculty },
        })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: 'Faculty was deleted successfully!',
                });
            } else {
                res.send({
                    message: `Cannot delete Faculty.`,
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: 'Could not delete Faculty',
            });
        });
};
