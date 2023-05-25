/**
 * Template credit: https://material-ui.com/getting-started/templates/
 */

/**

This component represents a scheduling view that allows users to select a plant,
view machine scheduling information, and force stop machines if needed.
It utilizes Material-UI components and handles state using hooks like useState and useEffect.
The user interface is rendered using JSX elements, with data dynamically populated and
status determined for each machine. Overall, it provides a convenient and interactive
scheduling experience within the application.
.
*/

import React, {useState ,useEffect} from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { getPlantScheduling, getPlants, stopScheduling, createMachineExpense } from "../../../utils/datafetcher";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  button:{
    width:"100%",
    textAlign: "center",
    borderColor: "rgb(0,0,0,0.8)",
    boxShadow: "1px 2px 1px 2px rgb(0,0,0,0.8)"

  },
  orderButton:{
    width: "40%",
    borderColor: "rgb(0,0,0,0.8)",
  },
  orderTextField:{
    width: "30%",
    marginLeft: "5px",
    marginRight: "5px",
    textAlign: "center"
  }
}));

//Table headers
const tableHeaders = ["Machine ID", "Current Job", "Status", "Start Time", "End Time", "Cost per hour", "Stop"];

export default function Scheduling() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectPlantIndex, setSelectedPlantIndex] = useState(0);
  const [allPlants, setAllPlants] = useState([]);
  const [data, setData] = useState(new Array());


  useEffect(()=>{
      let isMounted = true;
      //When retrieve machines when plant is changes
      getPlantScheduling(selectPlantIndex, res => setData(res.data))
      return ()=>{isMounted = false}

},[selectPlantIndex]);

    useEffect(() => {
      let isMounted = true;
      getPlants(res => setAllPlants(res.data))

      //Retrieve machines based off plants
      getPlantScheduling(selectPlantIndex, res => setData(res.data))
      return ()=>{isMounted = false}
    }, []);
    

  function handlePlantSelect (name){
    setSelectedPlantIndex(name);
  }

  function handleClick (event: React.MouseEvent<HTMLButtonElement>){
    setAnchorEl(event.currentTarget);
  };


  function handleClose (){
    setAnchorEl(null);
  }

  //Force stops the machine
  function handleForceStop(machine){
    alert("You have forced stopped machine: " + machine["machine_id"]+ ".")
    
    const amountAndProduction = calculateMachineExpenseAmount(machine);

    createMachineExpense(machine, amountAndProduction["amount"], amountAndProduction["production"]);

    stopScheduling(machine);
  }

    //Update machine in the backing to force stop
    // Function to calculate the machine expense amount from the start time, end time and cost per hour of running the machine
    // The function calculates the machine expense amount and production based on the machine's start time, cost per hour, and production per hour, considering the current time and adjusting for different hours or days.
  function calculateMachineExpenseAmount(machine){

    const today = new Date();
    const end_time =  (today.getHours() + 3)%24 + today.getMinutes()/60;
    const start_time = parseInt(machine["start_time"].substring(0,1)) + parseInt(machine["start_time"].substring(3,4))/60;
    let hour_diff = end_time - start_time;

    if(hour_diff < 0)
      hour_diff = 24 + hour_diff;
    
    return {
      "amount" : (hour_diff*machine["cost_per_hour"]).toFixed(2),
      "production" : hour_diff*machine["production_per_hour"]
    };
  }

  // Check the status of a machine depending on its start time, end time and if it has been forced stopped
  function determineMachineStatus(start, end, currentStatus){
    const today = new Date();
    const time = (today.getHours() + 3)%24 + ":" + today.getMinutes() + ":" + today.getSeconds();

    if(currentStatus == "Stopped")
      return "Stopped";
    else
      if(start < time && time < end)
        return "In use";
      else
        return "Not in use";
  }

  return (
    <>
    <TableContainer>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell align = "center">
            <Button className = {classes.button} onClick={handleClick}>Choose plant: {(allPlants[selectPlantIndex])? allPlants[selectPlantIndex]["name"]:""}</Button>
              <Menu id = "plant" anchorEl = {anchorEl} keepMounted open = {Boolean(anchorEl)} onClose={handleClose}>
              {Object.keys(allPlants).map((item, key)=>{
                return <MenuItem key={key} onClick = {()=>{handlePlantSelect(item);handleClose()}}>{allPlants[item].name}</MenuItem>
              })}
              </Menu>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    <div className={classes.root}>
      <form style = {{width:"100%"}}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
            {tableHeaders.map((item, i)=>{
              return <TableCell key={i} align = "center">{item}</TableCell>
            })}
            </TableRow>
          </TableHead>
          <TableBody>
            {
              data.map((row, key)=>{
                const status = determineMachineStatus(row["start_time"], row["end_time"], row["status"]);
                return ( 
                <TableRow key ={key}>
                  <TableCell align = "center">{row["machine_id"]}</TableCell>
                  <TableCell align = "center">{row["job"]}</TableCell>
                  <TableCell align = "center">{status}</TableCell>
                  <TableCell align = "center">{row["start_time"]}</TableCell>
                  <TableCell align = "center">{row["end_time"]}</TableCell>
                  <TableCell align = "center">{row["cost_per_hour"].toFixed(2)}</TableCell>
                  <TableCell align = "center">
                    <Button disabled = {status != "In use"} className = {classes.button} onClick={()=>handleForceStop(row)}>Force Stop</Button>
                  </TableCell>
                </TableRow>)
              })
            }
            </TableBody> 
        </Table>
      </TableContainer>

      </form>
    </div>
   
    </>
  );
}
