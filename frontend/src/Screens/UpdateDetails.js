import React, { useState, useEffect } from "react";
import "../StyleSheets/Welcome.css";
import "../StyleSheets/AdminOptions.css";
import "../StyleSheets/Table.css";
import { useFormik } from "formik";
import { base_url } from "../baseUrl";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import moment from "moment";
const UpdateDetails = (props) => {
  const [departmentsList, setDeplist] = useState([]);
  const [ctcList, setctcList] = useState([]);
  const [payrollsList, setPayrolls] = useState([]);
  const [extrasList, setExtraslist] = useState([]);
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [msg, setMessage] = useState("");
  const [amount, setAmount] = useState(0);
  const [ex_type, setExtype] = useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    history.goBack();
  };
  const initialValues = {
    name: "",
    dob: "",
    city: "",
    state: "",
    pincode: "",
    address: "",
    dept_id: "",
    ctc_id: "",
    doj: "",
    experience: "",
    phone: "",
    designation: "",
    email: props.location.state.email,
  };
  const onSubmit = async (values) => {
    console.log(values);
    const body = JSON.stringify(values);
    fetch(`${base_url}updateEmployeeData`, {
      method: "POST",
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setMessage(res.message);
        // console.log(res.data);
        handleClickOpen();
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const onIssuePay = async (values) => {
    console.log(values);
    const body = JSON.stringify(values);
    fetch(`${base_url}createPayroll`, {
      method: "POST",
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setMessage(res.message);
        // console.log(res.data);
        handleClickOpen();
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const formik = useFormik({
    initialValues,
    onSubmit,
  });
  useEffect(() => {
    getDepartments();
    getCtc();
    getDetails();
  }, []);
  const getDepartments = async () => {
    fetch(`${base_url}getDepartments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setDeplist(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getCtc = async () => {
    fetch(`${base_url}ctc`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setctcList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getExtras = async () => {
    fetch(`${base_url}getExtras`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setExtraslist(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getDetails = async () => {
    console.log(props.location.state.email);
    fetch(`${base_url}employeeDetails/${props.location.state.email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log(res.data[0])
        console.log(
          moment(res.data[0].dob.slice(0, 10), "YYYY-MM-DD").format(
            "MM/DD/YYYY"
          )
        );
        formik.setFieldValue("name", res.data[0].name);
        formik.setFieldValue(
          "dob",
          moment(res.data[0].dob.slice(0, 10), "YYYY-MM-DD").format(
            "YYYY-MM-DD"
          )
        );
        formik.setFieldValue("city", res.data[0].city);
        formik.setFieldValue("state", res.data[0].state);
        formik.setFieldValue("pincode", res.data[0].pincode);
        formik.setFieldValue("address", res.data[0].address);
        formik.setFieldValue(
          "doj",
          moment(res.data[0].doj.slice(0, 10), "YYYY-MM-DD").format(
            "YYYY-MM-DD"
          )
        );
        formik.setFieldValue("dept_id", res.data[0].dept_id);
        formik.setFieldValue("ctc_id", res.data[0].ctc_id);
        formik.setFieldValue("experience", res.data[0].experience);
        formik.setFieldValue("phone", res.data[0].phone);
        formik.setFieldValue("designation", res.data[0].designation);
        payrollFormik.setFieldValue("emp_id", res.data[0].e_id);
        appraisalFormik.setFieldValue("emp_id", res.data[0].e_id);
        appraisalFormik.setFieldValue("base_ctc_id",  res.data[0].ctc_id);
        fetchPayrollData(res.data[0].ctc_id, res.data[0].e_id)
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchPayrollData = async (ctc_id, e_id) => {
    fetch(`${base_url}ctc/${ctc_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(res => {
        const hra = res.data[0].hra / 12;
        let pf = res.data[0].pf / 12;
        let health_care = res.data[0].health_care / 12;
        let bonus = res.data[0].bonus / 12;
        let basic_pay = res.data[0].basic_pay / 12;
        let social_security_tax = (basic_pay / 100) * 2;
        let income_tax = (basic_pay / 100) * 6;
        let state_tax = (basic_pay / 100) * 6;
        let net_salary = (basic_pay + hra + bonus) - (pf + health_care + social_security_tax + income_tax + state_tax)
        payrollFormik.setFieldValue("basic_pay", Number(basic_pay.toFixed(2)));
        payrollFormik.setFieldValue("hra", Number(hra.toFixed(2)));
        payrollFormik.setFieldValue("pf", Number(pf.toFixed(2)));
        payrollFormik.setFieldValue("health_care", Number(health_care.toFixed(2)));
        payrollFormik.setFieldValue("bonus", Number(bonus.toFixed(2)));
        payrollFormik.setFieldValue("social_security_tax", Number(social_security_tax.toFixed(2)));
        payrollFormik.setFieldValue("income_tax", Number(income_tax.toFixed(2)));
        payrollFormik.setFieldValue("state_tax", Number(state_tax.toFixed(2)));
        payrollFormik.setFieldValue("net_salary", Number(net_salary.toFixed(2)));
        setExtype(res[0].ex_id)
        setAmount(res[0].amount)
      })
      .catch(err => {
        console.error(err);
      })

    fetch(`${base_url}employeePayroll/${e_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(res => res.json()).then(res => {
      setPayrolls(res.data);
    })
  }
  const departments = departmentsList.map((dept) => {
    return <option value={dept.dept_id}>{dept.dept_name}</option>;
  });
  const payrolls = payrollsList.map((payroll) => {
    return <tr><td data-th="Transaction">{payroll.transaction_id}</td>
      <td data-th="Base">{payroll.basic_pay}</td>
      <td data-th="HRA">{payroll.hra}</td>
      <td data-th="bonus">{payroll.bonus}</td>
      <td data-th="Tax">{Number(payroll.social_security_tax) + Number(payroll.income_tax) + Number(payroll.state_tax)}</td>
      <td data-th="Health">{payroll.health_care}</td>
      <td data-th="PF">{payroll.pf}</td>
      <td data-th="Net">{payroll.net_salary}</td>
    </tr>;
  })
  const ctcs = ctcList.map((ctc) => {
    return <option value={ctc.id}>{ctc.ctc}</option>;
  });
  const initialPayrollValues = {
    basic_pay: "",
    hra: "",
    social_security_tax: "",
    health_care: "",
    income_tax: "",
    state_tax: "",
    net_salary: "",
    leave_deductions: 0,
    pf: "",
    bonus: "",
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  };
  const payrollFormik = useFormik({
    initialValues: initialPayrollValues,
    onSubmit: onIssuePay
  })

  const handleLeaveChange = (event) => {
    payrollFormik.setFieldValue("leave_deductions", Number(event.target.value));
    const net_salary = (payrollFormik.values.basic_pay + payrollFormik.values.hra + payrollFormik.values.bonus) - (payrollFormik.values.pf + payrollFormik.values.health_care + payrollFormik.values.social_security_tax + payrollFormik.values.income_tax + payrollFormik.values.state_tax)
    payrollFormik.setFieldValue("net_salary", Number((net_salary - Number(event.target.value)).toFixed(2)));
  }
  const initialAppraisalValues={
    base_ctc_id:"",
    emp_id:"",
    appraisal:5,
  }
  
  const giveAppraisal = async (values) => {
    console.log(values);
    const body = JSON.stringify(values);
    fetch(`${base_url}appraisal`, {
      method: "POST",
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setMessage(res.message);
        // console.log(res.data);
        handleClickOpen();
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const appraisalFormik=useFormik({
    initialValues:initialAppraisalValues,
    onSubmit:giveAppraisal
  })

 

  return (
    <>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Message"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {msg}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <h1>Employee Details</h1>
      <div className="App">
        <form className="form" onSubmit={formik.handleSubmit}>
          <h3>Basic Details</h3>
          <hr className="Underline" />
          <div className="grouping">

            <div className="form-control">
              <label htmlFor="name">Name : </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange("name")}
                required
              />
              <span class="separator"> </span>
            </div>

            <div className="form-control">
              <label htmlFor="dob">Dob : </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formik.values.dob}
                onChange={formik.handleChange("dob")}
                required
              />
              <span class="separator"> </span>
            </div>
            <div className="form-control">
              <label htmlFor="address">Address : </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange("address")}
                required
              />
              <span class="separator"> </span>
            </div>
            <div className="form-control">
              <label htmlFor="city">City : </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange("city")}
                required
              />
              <span class="separator"> </span>
            </div>
            <div className="form-control">
              <label htmlFor="state">State : </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formik.values.state}
                onChange={formik.handleChange("state")}
                required
              />
              <span class="separator"> </span>
            </div>
            <div className="form-control">
              <label htmlFor="pincode" className="pincode">
                Pin-Code :{" "}
              </label>
              <input
                type="number"
                id="pincode"
                name="pincode"
                value={formik.values.pincode}
                onChange={formik.handleChange("pincode")}
                size="6"
                maxLength="6"
              />
              <span class="separator"> </span>
            </div>
            <div className="form-control">
              <label htmlFor="pincode" className="experience">
                Experience :{" "}
              </label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formik.values.experience}
                onChange={formik.handleChange("experience")}
                size="2"
                maxLength="2"
              />
              <span class="separator"> </span>
            </div>
            <div className="form-control">
              <label htmlFor="phone">Phone : </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange("phone")}
                required
              />
              <span class="separator"> </span>
            </div>
            <div className="form-control">
              <label htmlFor="designation">designation : </label>
              <input
                type="text"
                id="designation"
                name="designation"
                value={formik.values.designation}
                onChange={formik.handleChange("designation")}
                required
              />
              <span class="separator"> </span>
            </div>
          </div>
          <h3>Company Details</h3>
          <hr className="Underline" />
          <div className="grouping">

            {/* <div className="form-control">
              <label htmlFor="org_name">Email : </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange("email")}
                required
              />
            </div> */}
            <div className="form-control">
              <label htmlFor="Dept">Department: </label>
              <select
                style={styles.dropDown}
                value={formik.values.dept_id}
                onChange={formik.handleChange("dept_id")}
                required
              >
                {departments}
              </select>
            </div>
            <div className="form-control">
              <label htmlFor="grade_id">CTC : </label>
              <select
                style={styles.dropDown}
                value={formik.values.ctc_id}
                onChange={formik.handleChange("ctc_ic")}
                required
                disabled
              >
                {ctcs}
              </select>
            </div>
            <div className="form-control">
              <label htmlFor="doj">doj : </label>
              <input
                // style={styles.input}
                type="date"
                id="doj"
                name="doj"
                value={formik.values.doj}
                onChange={formik.handleChange("doj")}
                required
              />
            </div>
          </div>
          <button type="submit">Update</button>
        </form>
      </div>
      <div className="App">
        <form className="form" onSubmit={payrollFormik.handleSubmit}>
          <h3>Payroll</h3>
          <hr className="Underline" />
          <div className="grouping">
            <div className="form-control">
              <label htmlFor="basic_pay">Basic Pay : </label>
              <input
                type="number"
                id="basic_pay"
                name="basic_pay"
                value={payrollFormik.values.basic_pay}
                onChange={payrollFormik.handleChange("basic_pay")}
                required
                disabled
              />
            </div>

            <div className="form-control">
              <label htmlFor="hra">HRA : </label>
              <input
                type="number"
                id="hra"
                name="hra"
                value={payrollFormik.values.hra}
                onChange={payrollFormik.handleChange("hra")}
                required
                disabled
              />
            </div>
            <div className="form-control">
              <label htmlFor="social_security_tax">Social Security Tax : </label>
              <input
                type="number"
                id="social_security_tax"
                name="social_security_tax"
                value={payrollFormik.values.social_security_tax}
                onChange={payrollFormik.handleChange("social_security_tax")}
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="health_care">Health Care: </label>
              <input
                type="number"
                id="health_care"
                name="health_care"
                value={payrollFormik.values.health_care}
                onChange={payrollFormik.handleChange("health_care")}
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="income_tax">Income Tax : </label>
              <input
                type="number"
                id="income_tax"
                name="income_tax"
                value={payrollFormik.values.income_tax}
                onChange={payrollFormik.handleChange("income_tax")}
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="state_tax" className="state_tax">
                State Tax:{" "}
              </label>
              <input
                type="number"
                id="state_tax"
                name="state_tax"
                value={payrollFormik.values.state_tax}
                onChange={payrollFormik.handleChange("state_tax")}
                size="6"
                maxLength="6"
              />
            </div>
            <div className="form-control">
              <label htmlFor="net_salary" className="net_salary">
                Net Salary :{" "}
              </label>
              <input
                type="number"
                id="net_salary"
                name="net_salary"
                value={payrollFormik.values.net_salary}
                onChange={payrollFormik.handleChange("net_salary")}
                disabled
              />
            </div>
            <div className="form-control">
              <label htmlFor="leave_deductions">Leave Deductions : </label>
              <input
                type="number"
                id="leave_deductions"
                name="leave_deductions"
                value={payrollFormik.values.leave_deductions}
                onChange={handleLeaveChange}
              />
            </div>
            <div className="form-control">
              <label htmlFor="pf">PF : </label>
              <input
                type="number"
                id="pf"
                name="pf"
                value={payrollFormik.values.pf}
                onChange={payrollFormik.handleChange("pf")}
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="bonus">bonus : </label>
              <input
                type="number"
                id="bonus"
                name="bonus"
                value={payrollFormik.values.bonus}
                onChange={payrollFormik.handleChange("bonus")}
                required
              />
            </div>
          </div>
          <button type="submit">Issue Pay</button>
        </form>
        <form className="form">
          <table class="rwd-table">
            <tr>
              <th>Transaction</th>
              <th>Base</th>
              <th>HRA</th>
              <th>bonus</th>
              <th>Tax</th>
              <th>Health Care</th>
              <th>PF</th>
              <th>Net Salary</th>
            </tr>
            {payrolls}
          </table>
        </form>
      </div>
      <div className="App">
      <form className="form" onSubmit={appraisalFormik.handleSubmit}>
      <h3>Appraisal</h3>
          <hr className="Underline" />
          <div className="grouping">
          <div className="form-control">
              <label htmlFor="ctc_id">Current CTC : </label>
              <select
                style={styles.dropDown}
                value={formik.values.ctc_id}
                onChange={formik.handleChange("ctc_ic")}
                required
                disabled
              >
                {ctcs}
              </select>
            </div>

            <div className="form-control">
              <label htmlFor="appraisal">Appraisal (%) </label>
              <input
                type="number"
                id="appraisal"
                name="appraisal"
                value={appraisalFormik.values.appraisal}
                onChange={appraisalFormik.handleChange("appraisal")}
                required
              />
            </div>
          </div>
          <button type="submit">Issue Appriasal</button>
      </form>
      </div>
    </>
  );
};

const styles = {
  input: {
    width: window.innerWidth / 4.5,
    height: "70%",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "black",
    marginTop: "1%",
  },
  dropDown: {
    // width: window.innerWidth / 7.5,
    // height: window.innerHeight / 25,
    // backgroundColor: "hsl(212deg 33% 89%)",
    // borderWidth: 0,
    // borderColor: "black",
    // borderRadius: 5,
    // marginTop: "1%",
  },
};
export default UpdateDetails;
