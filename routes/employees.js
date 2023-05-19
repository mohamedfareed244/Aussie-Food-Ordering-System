
import Router from "express"
import {Emp} from "../models/Employees";
const router=Router();

 router.post('/', (req, res)=> {
  
    const employee=new Emp(req.body);
    employee
    .save( )
    .then( result => {
     console.log("succesfully saved");
    })
    .catch( err => {
      console.log(err);
    });
  })






  router.get("/", (req, res) => {
 
    employee.find()
      .then((result) => {
        res.render("index", { arrEmp: result });
      })
      .catch((err) => {
        console.log(err);
      });
  });




// app.get('/', (req, res) => 
// {
//   res.render('index')
// })


router.get('/', (req, res) => 
  {

    res.render('dashboard-employees')
 })



 export default router;