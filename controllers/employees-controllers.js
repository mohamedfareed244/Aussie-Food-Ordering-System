
import {Emp} from "../models/Employees";
 


const postemployees=(req, res)=> {
  
    const employee=new Emp(req.body);
    employee
    .save( )
    .then( result => {
     console.log("succesfully saved");
    })
    .catch( err => {
      console.log(err);
    });
  }

  const getemployees= (req, res) => {
 
    employee.find()
      .then((result) => {
        res.render("index", { arrEmp: result });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  export {getemployees,postemployees};