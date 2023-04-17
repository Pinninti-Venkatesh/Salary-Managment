import React, { useState } from "react";
import logo from "../Assets/Logo.png";
import "../StyleSheets/Welcome.css";
import "../StyleSheets/AdminOptions.css";
import { useFormik } from "formik";
import { base_url } from "../baseUrl";
import { useHistory } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

const AddCtc = () => {
  const [open, setOpen] = useState(false);
  const [msg, setMessage] = useState("");
  const history = useHistory();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    history.goBack();
  };
  const initialValues = {
    ctc: 0,
    basic_pay: 0,
    hra: 0,
    pf: 0,
    health_care: 0,
    stocks:0,
    bonus:0,
  };
  const onSubmit = async (values) => {
    console.log(values);
    const body = JSON.stringify(values);

    fetch(`${base_url}addCtc`, {
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
      <div className="App">
        <header>
          <h1>Salary Management System</h1>
          <hr className="Underline" />
          <img src={logo} alt="logo"></img>
        </header>
        <form className="form" onSubmit={formik.handleSubmit}>
          <div className="form-control">
            <label htmlFor="ctc">CTC </label>
            <input
              type="number"
              id="ctc"
              name="ctc"
              value={formik.values.ctc}
              onChange={formik.handleChange("ctc")}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="basic_pay">Basic Pay : </label>
            <input
              type="number"
              id="basic_pay"
              name="basic_pay"
              value={formik.values.basic_pay}
              onChange={formik.handleChange("basic_pay")}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="hra">HRA : </label>
            <input
              type="number"
              id="hra"
              name="hra"
              value={formik.values.hra}
              onChange={formik.handleChange("hra")}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="pf">PF : </label>
            <input
              type="number"
              id="pf"
              name="pf"
              value={formik.values.pf}
              onChange={formik.handleChange("pf")}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="bonus">Bonus : </label>
            <input
              type="number"
              id="bonus"
              name="bonus"
              value={formik.values.bonus}
              onChange={formik.handleChange("bonus")}
            />
          </div>
          <div className="form-control">
            <label htmlFor="health_care">Health Care : </label>
            <input
              type="number"
              id="health_care"
              name="health_care"
              value={formik.values.health_care}
              onChange={formik.handleChange("health_care")}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="stocks">Stocks : </label>
            <input
              type="number"
              id="stocks"
              name="stocks"
              value={formik.values.stocks}
              onChange={formik.handleChange("stocks")}
            />
          </div>
          <button type="submit">Add CTC</button>
        </form>
      </div>
    </>
  );
};

export default AddCtc;
