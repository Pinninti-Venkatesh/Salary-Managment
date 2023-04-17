const uuid = require("uuid");
const db = require("../db");
const Helper = require("./Helper");
const createAdmin = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res
      .status(400)
      .send({ message: "Please enter all required fields" });
  }
  if (!Helper.isValidEmail(req.body.email)) {
    return res
      .status(400)
      .send({ message: "Please enter a valid email address" });
  }
  //console.log(req)
  const hashPassword = Helper.hashPassword(req.body.password);
  const createQuery = `INSERT INTO admin(admin_id,username,email,password) VALUES($1,$2,$3,$4) returning *`;
  const values = [uuid.v4(), req.body.username, req.body.email, hashPassword];
  try {
    const { rows } = await db.query(createQuery, values);
    const token = Helper.generateToken(rows[0].email);
    //console.log("This is token ",token)
    return res.status(201).send({ message: "Account.Create", token: token });
  } catch (err) {
    if (err.routine === "_bt_check_unique") {
      return res
        .status(400)
        .send({ message: "Email address is already taken" });
    }
    return res.status(400).send(err);
  }
};
const adminLogin = async (req, res) => {
  //console.log(req);
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .send({ message: "Please enter a valid email address" });
  }
  if (!Helper.isValidEmail(req.body.email)) {
    return res
      .status(400)
      .send({ message: "Please enter a valid email address" });
  }
  const query = "SELECT * FROM admin where email = $1";
  try {
    const { rows } = await db.query(query, [req.body.email]);
    if (!rows[0]) {
      return res
        .status(400)
        .send({ message: "The credentials you provided is incorrect" });
    }
    if (!Helper.comparePassword(rows[0].password, req.body.password)) {
      return res
        .status(400)
        .send({ message: "The credentials you provided is incorrect" });
    }
    const token = Helper.generateToken(rows[0].email);
    return res.status(200).send({ message: "Auth.verified", token: token });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};
const createEmployee = async (req, res) => {
  const query = `INSERT INTO employee(
    paid_leave_taken,
    encashed_leave_this_month,
    encashed_leave_till_date,
    e_id,
    doj,
    name,
    dob,
    address,
    city,
    state,
    pincode,
    email,
    password,
    dept_id,
    ctc_id,
    designation,
    experience,
    phone)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) 
    returning *`;
  const hashPassword = Helper.hashPassword("abcd1234");
  //console.log(req.body);
  const values = [
    0,
    0,
    0,
    uuid.v4(),
    req.body.doj,
    req.body.name,
    req.body.dob,
    req.body.address,
    req.body.city,
    req.body.state,
    req.body.pincode,
    req.body.email,
    hashPassword,
    req.body.dept_id,
    req.body.ctc_id,
    req.body.designation,
    req.body.experience,
    req.body.phone
  ];
  try {
    const { rows } = await db.query(query, values);
    db.query(`update ctc set emp_id=${rows.e_id} where id=${req.body.ctc_id}`)
    return res.status(201).send({ message: "User Added" });
  } catch (err) {
    //console.log(err);
    if (err.routine === "_bt_check_unique") {
      return res
        .status(400)
        .send({ message: "Email address is already taken" });
    }
    return res.status(400).send({ error: err });
  }
};
const deleteEmployee = async (req, res) => {
  const query = `DELETE FROM Employee WHERE email = $1`;
  try {
    const { rows } = await db.query(query, [req.body.email]);
    return res.status(200).send({ message: "User.Deleted" });
  } catch (err) {
    return res.status(400).send({ error: err });
  }
};
const getAllEmployees = async (req, res) => {
  const query = `SELECT * from employee`;
  try {
    const { rows } = await db.query(query);
    // //console.log(rows);
    return res.status(200).send({ message: "All Employees", data: rows });
  } catch (err) {
    return res.status(400).send({ error: err });
  }
};
const employeeLogin = async (req, res) => {
  //console.log(req);
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .send({ message: "Please enter a valid email address" });
  }
  if (!Helper.isValidEmail(req.body.email)) {
    return res
      .status(400)
      .send({ message: "Please enter a valid email address" });
  }
  const query = "SELECT * FROM employee where email = $1";
  try {
    const { rows } = await db.query(query, [req.body.email]);
    //console.log(rows);
    if (!rows[0]) {
      return res
        .status(400)
        .send({ message: "The credentials you provided is incorrect" });
    }
    if (!Helper.comparePassword(rows[0].password, req.body.password)) {
      return res
        .status(400)
        .send({ message: "The credentials you provided is incorrect" });
    }
    const token = Helper.generateToken(rows[0].email);
    return res.status(200).send({ message: "Auth.verified", token: token });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};
const getEmployeeProfile = async (req, res) => {
  // console.log(req.params);
  const query = "SELECT * FROM employee where email = $1";
  try {
    const { rows } = await db.query(query, [req.params.email]);
    //console.log(rows);
    return res.status(200).send({ message: "Employee Data", data: rows });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};
const updateEmployeedata = async (req, res) => {
  const queryGet = "SELECT * FROM employee where email=$1";
  console.log(req.body.email);
  // var data = {};
  // try {
  //   const employee = await db.query(queryGet, [req.body.email]);
  //   data = employee.rows[0];
  // } catch (err) {
  //   console.log(err);
  // }
  // //console.log("Data that is to be updated ", data);

  const updateQuery = `UPDATE employee set 
  doj=$1,
  name=$2,
  dob=$3,
  address=$4,
  city=$5,
  state=$6,
  pincode=$7,
  dept_id=$8,
  experience=$9,
  phone=$10,
  designation=$11
  where email=$12
  returning *`;
  //console.log(req.body.dob, data.dob);
  // const values = [
  //   req.body.doj !== undefined ? req.body.doj : data.doj,
  //   req.body.name !== undefined ? req.body.name : data.name,
  //   req.body.dob !== undefined ? req.body.doj : data.doj,
  //   req.body.address !== undefined ? req.body.address : data.address,
  //   req.body.city !== undefined ? req.body.city : data.city,
  //   req.body.state !== undefined ? req.body.state : data.state,
  //   req.body.pincode !== undefined ? req.body.pincode : data.pincode,
  //   req.body.org_name !== undefined ? req.body.org_name : data.org_name,
  //   req.body.dept_id !== undefined ? req.body.dept_id : data.dept_id,
  //   req.body.grade_id !== undefined ? req.body.grade_id : data.grade_id,
  //   req.body.email
  // ];
  const values = [
    req.body.doj,
    req.body.name,
    req.body.dob,
    req.body.address,
    req.body.city,
    req.body.state,
    req.body.pincode,
    req.body.dept_id,
    req.body.experience,
    req.body.phone,
    req.body.designation,
    req.body.email,
  ];
  //console.log(values);
  try {
    const { rows } = await db.query(updateQuery, values);
    ////console.log(rows);
    return res
      .status(200)
      .send({ message: "User data updated successfully", data: rows });
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};
const addDepartment = async (req, res) => {
  const query = `INSERT into department(
    dept_id,
    dept_name)
    VALUES($1,$2)`;
  const values = [uuid.v4(), req.body.dept_name];
  try {
    const { rows } = await db.query(query, values);
    ////console.log(rows);
    return res.status(200).send({
      message: "Department Added Successfully",
      data: rows,
    });
  } catch (err) {
    if (err.routine === "_bt_check_unique") {
      return res.status(400).send({ message: "Department already exists" });
    }
    return res.status(400).send({ message: err });
  }
};
const getDepartments = async (req, res) => {
  const query = `SELECT * from department`;
  try {
    const { rows } = await db.query(query);
    return res.status(200).send(rows);
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};
const updateEmployeePassword = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .send({ message: "Please enter a valid email address and password" });
  }
  if (!Helper.isValidEmail(req.body.email)) {
    return res
      .status(400)
      .send({ message: "Please enter a valid email address" });
  }
  const query = `UPDATE employee set password = $1 where email=$2 returning email,password`;
  const newPassword = Helper.hashPassword(req.body.password);
  const values = [newPassword, req.body.email];
  try {
    const { rows } = await db.query(query, values);
    return res
      .status(200)
      .send({ message: "Password updated successfully", data: rows });
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};
const updateAdminPassword = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .send({ message: "Please enter a valid email address and password" });
  }
  if (!Helper.isValidEmail(req.body.email)) {
    return res
      .status(400)
      .send({ message: "Please enter a valid email address" });
  }
  const query = `UPDATE admin set password = $1 where email=$2 returning email,password`;
  const newPassword = Helper.hashPassword(req.body.password);
  const values = [newPassword, req.body.email];
  try {
    const { rows } = await db.query(query, values);
    return res
      .status(200)
      .send({ message: "Password updated successfully", data: rows });
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};
const markAttendance = async (req, res) => {
  const updateQuery = `UPDATE employee set
  present=$1,
  paid_leave_taken=$2,
  encashed_leave_this_month=$3
  where email=$4
  returning *`;
  const values = [
    req.body.present === 1 ? 1 : 0,
    req.body.paid_leave_taken === 1 ? 1 : 0,
    req.body.encashed_leave_this_month === 1 ? 1 : 0,
    req.body.email,
  ];
  try {
    const { rows } = await db.query(updateQuery, values);
    //console.log(rows);
    return res
      .status(200)
      .send({ message: "Attendance recorded successfully", data: rows });
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

const generateReports = async (req, res) => {
  // console.log(req);
  const { mail } = req.params;
  console.log(mail);
  const query = `WITH T AS 
  (Select * from 
  employee,payroll,gradepay 
  where 
  employee.email = payroll.emp_mail and employee.grade_id = gradepay.grade_id)
  Select * from T where email=$1 and month=$2 and year=$3`;

  try {
    const { rows } = await db.query(query, [mail, 12, 2020]);
    console.log(rows);
    return res.status(200).send({ message: "Report Data", data: rows });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const createCtc = async (req, res) => {
  const query = `INSERT INTO ctc(
    id,
    ctc,
    basic_pay,
    hra,
    pf,
    health_care,
    stocks,
    bonus)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8) 
    returning *`;
  //console.log(req.body);
  const values = [
    uuid.v4(),
    req.body.ctc,
    req.body.basic_pay,
    req.body.hra,
    req.body.pf,
    req.body.health_care,
    req.body.stocks,
    req.body.bonus
  ];
  try {
    const { rows } = await db.query(query, values);
    return res.status(201).send({ message: "CTC Added" });
  } catch (err) {
    //console.log(err);
    // if (err.routine === "_bt_check_unique") {
    //   return res
    //     .status(400)
    //     .send({ message: "Email address is already taken" });
    // }
    return res.status(400).send({ error: err });
  }
};
const getAllCtc = async (req, res) => {
  const query = `SELECT * from ctc`;
  try {
    const { rows } = await db.query(query);
    return res.status(200).send({ message: "All ctc", data: rows });
  } catch (err) {
    return res.status(400).send({ error: err });
  }
};

const getCtc = async (req, res) => {
  // console.log(req.params);
  const query = "SELECT * FROM ctc where id = $1";
  try {
    const { rows } = await db.query(query, [req.params.id]);
    return res.status(200).send({ message: "ctc Data", data: rows });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const createPayroll = async (req, res) => {
  const query = `INSERT INTO payroll(
    id,
    transaction_id,
    basic_pay,
    hra,
    pf,
    health_care,
    social_security_tax,
    income_tax,
    state_tax,
    net_salary,
    leave_deductions,
    bonus,
    emp_id,
    month,
    year)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) 
    returning *`;
  //console.log(req.body);
  const values = [
    uuid.v4(),
    'TRA-'+((Math.abs(Math.random()*4000)).toFixed(0)),
    req.body.basic_pay,
    req.body.hra,
    req.body.pf,
    req.body.health_care,
    req.body.social_security_tax,
    req.body.income_tax,
    req.body.state_tax,
    req.body.net_salary,
    req.body.leave_deductions,
    req.body.bonus,
    req.body.emp_id,
    req.body.month,
    req.body.year
  ];
  try {
    const { rows } = await db.query(query, values);
    return res.status(201).send({ message: "CTC Added" });
  } catch (err) {
    //console.log(err);
    // if (err.routine === "_bt_check_unique") {
    //   return res
    //     .status(400)
    //     .send({ message: "Email address is already taken" });
    // }
    return res.status(400).send({ error: err,message:err.message });
  }
};

const getEmployeePayroll = async (req, res) => {
  // console.log(req.params);
  const query = "SELECT * FROM payroll where emp_id = $1 order by created_at desc";
  try {
    const { rows } = await db.query(query, [req.params.emp_id]);
    return res.status(200).send({ message: "ctc Data", data: rows });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const employeeCurrentCTC = async (req, res) => {
  const query = "select * from ctc where id=(select ctc_id from employee where id=$1)";
  try {
    const { rows } = await db.query(query, [req.params.emp_id]);
    return res.status(200).send({ message: "Data", data: rows });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const giveAppraisal = async (req, res) => {
  const query = "select * from ctc where id=(select ctc_id from employee where e_id=$1)";
  try {
    let { rows } = await db.query(query, [req.body.emp_id]);
    const hikePercent = req.body.appraisal;
    rows=rows[0];
    rows.basic_pay = parseFloat(rows.basic_pay) + ((parseFloat(rows.basic_pay) / 100) * hikePercent);
    rows.hra= parseFloat(rows.hra) + ((parseFloat(rows.hra) / 100) * hikePercent);
    rows.ctc=parseFloat(rows.basic_pay)+parseFloat(rows.hra)+parseFloat(rows.pf)+parseFloat(rows.health_care)+parseFloat(rows.stocks);
    rows.bonus=0;
    const insertCTCQuery = `INSERT INTO ctc(
      id,
      emp_id,
      ctc,
      basic_pay,
      hra,
      pf,
      health_care,
      stocks,
      bonus)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) 
      returning *`;
    //console.log(req.body);
    const values = [
      uuid.v4(),
      req.body.emp_id,
      rows.ctc,
      rows.basic_pay,
      rows.hra,
      rows.pf,
      rows.health_care,
      rows.stocks,
      rows.bonus
    ];
    let newCtc=await db.query(insertCTCQuery, values);
    
    newCtc=newCtc.rows
    console.log(newCtc)
    const appraisalInsertQuery=`INSERT INTO appraisal(id,appraisal,base_ctc_id,emp_id)
    VALUES($1,$2,$3,$4)`;
    const appraisalValues=[uuid.v4(),hikePercent,rows.id,req.body.emp_id];
    
    await db.query(appraisalInsertQuery,appraisalValues);
    await db.query(`update employee set ctc_id='${newCtc[0].id}' where e_id='${req.body.emp_id}'`)
    return res.status(200).send({ message: "Hike approved for employee" });
  } catch (error) {
    return res.status(400).send({  error: error,message:error.message });
  }
}

module.exports = {
  createAdmin,
  adminLogin,
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  employeeLogin,
  getEmployeeProfile,
  generateReports,
  updateEmployeedata,
  addDepartment,
  updateEmployeePassword,
  updateAdminPassword,
  getDepartments,
  markAttendance,
  generateReports,
  createCtc,
  getAllCtc,
  getCtc,
  createPayroll,
  getEmployeePayroll,
  employeeCurrentCTC,
  giveAppraisal
};
