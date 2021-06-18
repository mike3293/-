let Sequelize = require('sequelize');
let Model = Sequelize.Model;

class Faculty extends Model {
}

class Specialization extends Model {
}

class Group extends Model {
}

class Pulpit extends Model {
}

class Teacher extends Model {
}

class Student extends Model {
}

class Subject extends Model {
}

class Progress extends Model {
}

function internalORM(sequelize) {
    Faculty.init(
        {
            faculty: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
            faculty_name: { type: Sequelize.STRING, allowNull: false },
        },
        { sequelize, modelName: 'Faculty', tableName: 'Faculty', timestamps: false },
    );

    Specialization.init(
        {
            specialization: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
            faculty: {
                type: Sequelize.STRING, allowNull: true,
                references: { model: Faculty, key: 'faculty' },
            },
            specialization_name: { type: Sequelize.STRING, allowNull: false },
        },
        { sequelize, modelName: 'Specialization', tableName: 'Specialization', timestamps: false },
    );

    Group.init(
        {
            id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true },
            specialization: {
                type: Sequelize.STRING, allowNull: true,
                references: { model: Specialization, key: 'specialization' },
            },
            start_year: { type: Sequelize.INTEGER, allowNull: true },
        },
        { sequelize, modelName: 'Group', tableName: 'Group', timestamps: false },
    );

    Pulpit.init(
        {
            pulpit: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
            pulpit_name: { type: Sequelize.STRING, allowNull: false },
            faculty: {
                type: Sequelize.STRING, allowNull: false,
                references: { model: Faculty, key: 'faculty' },
            },
        },
        { sequelize, modelName: 'Pulpit', tableName: 'Pulpit', timestamps: false },
    );

    Teacher.init(
        {
            teacher: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
            teacher_name: { type: Sequelize.STRING, allowNull: false },
            gender: { type: Sequelize.CHAR(1), allowNull: false },
            pulpit: {
                type: Sequelize.STRING, allowNull: false,
                references: { model: Pulpit, key: 'pulpit' },
            },
        },
        { sequelize, modelName: 'Teacher', tableName: 'Teacher', timestamps: false },
    );

    Student.init(
        {
            id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
            group_id: {
                type: Sequelize.INTEGER, allowNull: true,
                references: { model: Group, key: 'id' },
            },
            name: { type: Sequelize.STRING, allowNull: true },
            bday: { type: Sequelize.DATE, allowNull: true },
            info: { type: Sequelize.STRING, allowNull: true },
            is_active: { type: Sequelize.BOOLEAN, allowNull: true },
        },
        { sequelize, modelName: 'Student', tableName: 'Student', timestamps: false },
    );

    Subject.init(
        {
            subject: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
            subject_name: { type: Sequelize.STRING, allowNull: true },
            pulpit: {
                type: Sequelize.STRING, allowNull: true,
                references: { model: Pulpit, key: 'pulpit' },
            },
        },
        { sequelize, modelName: 'Subject', tableName: 'Subject', timestamps: false },
    );

    Progress.init(
        {
            subject: { type: Sequelize.STRING, allowNull: true },
            student_id: {
                type: Sequelize.INTEGER, allowNull: true,
                references: { model: Student, key: 'id' },
            },
            date: { type: Sequelize.DATE, allowNull: true },
            note: { type: Sequelize.INTEGER, allowNull: true },
        },
        { sequelize, modelName: 'Progress', tableName: 'Progress', timestamps: false },
    );
    Progress.removeAttribute('id');

    Faculty.hasMany(Pulpit, { as: 'faculty_pulpits', foreignKey: 'faculty', sourceKey: 'faculty' });
    Pulpit.hasMany(Teacher, { as: 'pulpit_teachers', foreignKey: 'pulpit', sourceKey: 'pulpit' });
    sequelize.sync();
}

exports.ORM = (sequelize) => {
    internalORM(sequelize);
    return { Faculty, Pulpit, Teacher, Subject, Progress, Group, Student, Specialization };
};
