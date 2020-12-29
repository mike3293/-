const config = require('./dbconfig');
const sql = require('mssql');

async function getAllByName(name) {
    try {
        let pool = await sql.connect(config);
        let pulpits = await pool
            .request()
            .query(`SELECT * FROM ${name.toUpperCase()}`);
        return pulpits.recordsets[0];
    } catch (err) {
        console.log(err);
    }
}

async function postFaculties(faculty, faculty_name) {
    let pool = await sql.connect(config);
    return pool
        .request()
        .input('faculty', sql.NVarChar, faculty)
        .input('faculty_name', sql.NVarChar, faculty_name)
        .query(
            'INSERT FACULTY(FACULTY, FACULTY_NAME) values(@faculty , @faculty_name)',
        );
}

async function postPulpits(pulpit, pulpit_name, faculty) {
    let pool = await sql.connect(config);
    return pool
        .request()
        .input('pulpit', sql.NVarChar, pulpit)
        .input('pulpit_name', sql.NVarChar, pulpit_name)
        .input('faculty', sql.NVarChar, faculty)
        .query(
            'INSERT PULPIT(PULPIT, PULPIT_NAME, FACULTY) values(@pulpit , @pulpit_name, @faculty)',
        );
}

async function postSubjects(subject, subject_name, pulpit) {
    let pool = await sql.connect(config);
    return pool
        .request()
        .input('subject', sql.NVarChar, subject)
        .input('subject_name', sql.NVarChar, subject_name)
        .input('pulpit', sql.NVarChar, pulpit)
        .query(
            'INSERT SUBJECT(SUBJECT, SUBJECT_NAME, PULPIT) values(@subject , @subject_name, @pulpit)',
        );
}

async function postAuditoriumsTypes(auditorium_type, auditorium_typename) {
    let pool = await sql.connect(config);
    return pool
        .request()
        .input('auditorium_type', sql.NVarChar, auditorium_type)
        .input('auditorium_typename', sql.NVarChar, auditorium_typename)
        .query(
            'INSERT AUDITORIUM_TYPE(AUDITORIUM_TYPE, AUDITORIUM_TYPENAME) values(@auditorium_type , @auditorium_typename)',
        );
}

async function postAuditoriums(
    auditorium,
    auditorium_name,
    auditorium_capacity,
    auditorium_type,
) {
    let pool = await sql.connect(config);
    return pool
        .request()
        .input('auditorium', sql.NVarChar, auditorium)
        .input('auditorium_name', sql.NVarChar, auditorium_name)
        .input('auditorium_capacity', sql.Int, auditorium_capacity)
        .input('auditorium_type', sql.NVarChar, auditorium_type)
        .query(
            'INSERT AUDITORIUM(AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_CAPACITY, AUDITORIUM_TYPE)' +
            ' values(@auditorium, @auditorium_name, @auditorium_capacity, @auditorium_type)',
        );
}

async function putFaculties(faculty, faculty_name) {
    let pool = await sql.connect(config);
    return pool
        .request()
        .input('faculty', sql.NVarChar, faculty)
        .input('faculty_name', sql.NVarChar, faculty_name)
        .query(
            'UPDATE FACULTY SET FACULTY_NAME = @faculty_name WHERE FACULTY = @faculty',
        );
}

async function putPulpits(pulpit, pulpit_name, faculty) {
    let pool = await sql.connect(config);
    return pool
        .request()
        .input('pulpit', sql.NVarChar, pulpit)
        .input('pulpit_name', sql.NVarChar, pulpit_name)
        .input('faculty', sql.NVarChar, faculty)
        .query(
            'UPDATE PULPIT SET PULPIT_NAME = @pulpit_name, FACULTY = @faculty WHERE PULPIT = @pulpit',
        );
}

async function putSubjects(subject, subject_name, pulpit) {
    let pool = await sql.connect(config);
    return pool
        .request()
        .input('subject', sql.NVarChar, subject)
        .input('subject_name', sql.NVarChar, subject_name)
        .input('pulpit', sql.NVarChar, pulpit)
        .query(
            'UPDATE SUBJECT SET SUBJECT_NAME = @subject_name, PULPIT = @pulpit WHERE SUBJECT = @subject',
        );
}

async function putAuditoriumsTypes(auditorium_type, auditorium_typename) {
    let pool = await sql.connect(config);
    return pool
        .request()
        .input('auditorium_type', sql.NVarChar, auditorium_type)
        .input('auditorium_typename', sql.NVarChar, auditorium_typename)
        .query(
            'UPDATE AUDITORIUM_TYPE SET AUDITORIUM_TYPENAME = @auditorium_typename WHERE AUDITORIUM_TYPE = @auditorium_type',
        );
}

async function putAuditoriums(
    auditorium,
    auditorium_name,
    auditorium_capacity,
    auditorium_type,
) {
    let pool = await sql.connect(config);
    return pool
        .request()
        .input('auditorium', sql.NVarChar, auditorium)
        .input('auditorium_name', sql.NVarChar, auditorium_name)
        .input('auditorium_capacity', sql.Int, auditorium_capacity)
        .input('auditorium_type', sql.NVarChar, auditorium_type)
        .query(
            'UPDATE AUDITORIUM SET AUDITORIUM_NAME = @auditorium_name, AUDITORIUM_CAPACITY = @auditorium_capacity, AUDITORIUM_TYPE =  @auditorium_type' +
            ' WHERE AUDITORIUM = @auditorium',
        );
}

async function deleteFaculties(faculty_name) {
    let pool = await sql.connect(config);
    return pool
        .request()
        .input('faculty_name', sql.NVarChar, faculty_name)
        .query('DELETE FROM FACULTY WHERE FACULTY = @faculty_name');
}

async function deletePulpits(pulpit_name) {
    let pool = await sql.connect(config);
    return pool
        .request()
        .input('pulpit_name', sql.NVarChar, pulpit_name)
        .query('DELETE FROM PULPIT WHERE PULPIT = @pulpit_name');
}

async function deleteSubjects(subject_name) {
    let pool = await sql.connect(config);
    return pool
        .request()
        .input('subject_name', sql.NVarChar, subject_name)
        .query('DELETE FROM SUBJECT WHERE SUBJECT = @subject_name');
}

async function deleteAuditoriumsTypes(auditorium_typename) {
    let pool = await sql.connect(config);
    return pool
        .request()
        .input('auditorium_typename', sql.NVarChar, auditorium_typename)
        .query(
            'DELETE FROM AUDITORIUM_TYPE WHERE AUDITORIUM_TYPE = @auditorium_typename',
        );
}

async function deleteAuditoriums(auditorium_name) {
    let pool = await sql.connect(config);
    return pool
        .request()
        .input('auditorium_name', sql.NVarChar, auditorium_name)
        .query('DELETE FROM AUDITORIUM WHERE AUDITORIUM = @auditorium_name');
}

module.exports = {
    getAllByName,
    postFaculties,
    postPulpits,
    postSubjects,
    postAuditoriumsTypes,
    postAuditoriums,
    putFaculties,
    putPulpits,
    putSubjects,
    putAuditoriumsTypes,
    putAuditoriums,
    deleteFaculties,
    deletePulpits,
    deleteSubjects,
    deleteAuditoriumsTypes,
    deleteAuditoriums,
};
