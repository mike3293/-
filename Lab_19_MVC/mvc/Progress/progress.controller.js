const Sequelize = require('sequelize');
const config = require('../../db/config').config;
const sequelize = new Sequelize(config);
const db = require('../../db/db').ORM(sequelize);

exports.getAll = (req, res) => {
    sequelize.authenticate().then(() => {
        db.Progress.findAll()
            .then(progress => res.json(progress))
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            });
        ;
    });
};

exports.create = (req, res) => {
    sequelize.authenticate().then(() => {
        db.Progress.create({
                subject: req.body.subject,
                student_id: req.body.student_id,
                date: req.body.date,
                note: req.body.note,
            })
            .then(progress => res.json((progress)))
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            });
    });
};

exports.update = (req, res) => {
    sequelize.authenticate().then(() => {
        db.Progress.update(
            {
                subject: req.body.subject,
                date: req.body.date,
                note: req.body.note,
            },
            { where: { student_id: req.body.student_id } },
            )
            .then(count => res.json(({ updated_rows: count[0] })))
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            });
    });
};

exports.delete = (req, res) => {
    db.Progress.destroy({
            where: { student_id: parseInt(req.params.studentId, 10) },
        })
        .then(num => {
            if (num !== 0) {
                res.send({
                    message: 'Progress was deleted successfully!',
                });
            } else {
                res.send({
                    message: `Cannot delete Progress.`,
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
};
