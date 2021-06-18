const Sequelize = require('sequelize');
const config = require('../../db/config').config;
const sequelize = new Sequelize(config);
const db = require('../../db/db').ORM(sequelize);

exports.getAll = (req, res) => {
    sequelize.authenticate().then(() => {
        db.Student.findAll().then(students => res.json(students));
    });
};

exports.create = (req, res) => {
    sequelize.authenticate().then(() => {
        db.Student.create({
            group_id: req.body.group_id,
            name: req.body.name,
            bday: req.body.bday,
            info: req.body.info,
            is_active: req.body.is_active,
        }).then(student => res.json((student)))
            .catch((err) => {
                console.log(err);
            });
    });
};

exports.update = (req, res) => {
    sequelize.authenticate().then(() => {
        db.Student.update(
            {
                group_id: req.body.group_id,
                name: req.body.name,
                bday: req.body.bday,
                info: req.body.info,
                is_active: req.body.is_active,
            },
            { where: { id: req.body.id } },
            )
            .then(count => res.json(({ updated_rows: count[0] })))
            .catch((err) => {
                console.log(err);
                res.status(500).send(err);
            });
    });
};

exports.delete = (req, res) => {
    db.Student.destroy({
            where: { id: req.params.id },
        })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: 'Student was deleted successfully!',
                });
            } else {
                res.send({
                    message: `Cannot delete Student.`,
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: 'Could not delete Student',
            });
        });
};
