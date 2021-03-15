import React, {useEffect, useState} from 'react';
import { makeStyles, useTheme, fade } from "@material-ui/core/styles";
import axios from 'axios';

import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from '@material-ui/core/TableFooter';

const url = 'http://localhost:4000';

const useStyles = makeStyles((theme) => ({
    popupCheckout:{
        margin:"auto",
        width: "50%",
        height: "50%",
        top: "10%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        backgroundColor: theme.palette.primary.main,
        boxShadow: "1px 2px 2px rgba(0,0,0,0.9)",
        borderColor: theme.palette.primary.main,
        borderRadius : "10px",
    },
    DefectFormTable:{
        fontWeight: "bold",
        color: 'white'
    },
    DefectFormButton:{
        width:"100%",
        height:"100%",
        background: theme.palette.primary.main,
        color:'white'
    },
    DefectFormContainer:{
        height: '100%'
    },
    DefectDropDownButton:{
        width:"100%",
        textAlign: "center",
        borderColor: "rgb(0,0,0,0.8)",
        boxShadow: "1px 2px 1px 2px rgb(0,0,0,0.8)",
        background: "white",
        '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        color: "black"   
    },
    DefectTextArea:{
        height: '100%',
        width:"100%",
        resize:"none"
    }
  }));
 
//Defect types
const defectTypes = ["Damaged product", "Incomplete order shipped", "Wrong product", "Service Complaint"];

//Request action
const requestActions = ["Replace product", "Refund", "See comments"];

export default function DefectForm({open, closePopup, clientOrders, vendorOrders}){
    const classes = useStyles(useTheme());
    const [anchorElDefect, setAnchorElDefect] = useState<null | HTMLElement>(null);
    const [anchorElRequest, setAnchorElRequest] = useState<null | HTMLElement>(null);

    const [formOrderID, setFormOrderID] = useState(-1);
    const [formDefectType, setFormDefectType] = useState("");
    const [formRequest, setFormRequest] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formComment, setFormComment] = useState("");


    function handleSubmit(event){
      event.preventDefault();

      /**
       * Add items to our internal stock in the database
       * 
       */
       console.log(formOrderID,formDefectType,formRequest,formDescription, formComment);

       clearDefectVariables();
       closePopup();
    }

    function handleOrderID (e){
        setFormOrderID(e.target.value);
    }

    function handleClickDefect (event: React.MouseEvent<HTMLButtonElement>){
        setAnchorElDefect(event.currentTarget);
    };

    function handleClickRequest (event: React.MouseEvent<HTMLButtonElement>){
        setAnchorElRequest(event.currentTarget);
    };

    function handleDefectType(item){
        setFormDefectType(item);
    }

    function handleRequestType(item){
        setFormRequest(item);
    }

    function handleCloseDefect (){
        setAnchorElDefect(null);
    }

    function handleCloseRequest (){
        setAnchorElRequest(null);
    }

    function checkFormValid (){
        if ((vendorOrders === null || clientOrders === null)) return false;

        //Check the dropdown menu options are not empty
        let requestSet = (formRequest !== "");
        let defectSet = (formDefectType !== "");

        //Check the order id exists
        //Either check for client or vendors table, not both, depending on user type
        let orderIDExists = false;
        //console.log(localStorage.getItem('userRole'));

        let tempData = vendorOrders;

        tempData.map(element => {
            if (formOrderID === element["id"].toString()){
                orderIDExists = true;
                return;
            }
        });
       
        return requestSet && defectSet && orderIDExists;
    }

    function clearDefectVariables(){
        setFormComment("");
        setFormDescription("");
        setFormRequest("");
        setFormDefectType("");
        setFormOrderID(-1);
    }

    return (
        <Modal open={open} onClose = {()=>closePopup()} className = {classes.popupCheckout}>
        <TableContainer>
        <Table>
        <TableBody>  
            <TableRow> 
                <TableCell className={classes.DefectFormTable} align="left"><label>Order ID: </label><input required type="text" size={10} onChange = {(e)=>handleOrderID(e)}/></TableCell>
                <TableCell className={classes.DefectFormTable}align="center">
                    <Button className = {classes.DefectDropDownButton} onClick={handleClickDefect}>{(formDefectType === "" )? "Choose Defect Type":"Defect: "+formDefectType}</Button>
                    <Menu id = "defectList" anchorEl = {anchorElDefect} keepMounted open = {Boolean(anchorElDefect)} onClose={handleCloseDefect}>
                        {defectTypes.map((item, key)=> {return <MenuItem key={key} onClick = {()=>{handleDefectType(item);handleCloseDefect()}}>{item}</MenuItem>})}
                    </Menu>    
                </TableCell>
                <TableCell className={classes.DefectFormTable} align="right">
                    <Button className = {classes.DefectDropDownButton} onClick={handleClickRequest}>{(formRequest === "" )? "Choose Request Action":"Request: "+formRequest}</Button>
                    <Menu id = "defectList" anchorEl = {anchorElRequest} keepMounted open = {Boolean(anchorElRequest)} onClose={handleCloseRequest}>
                        {requestActions.map((item, key)=> {return <MenuItem key={key} onClick = {()=>{handleRequestType(item);handleCloseRequest()}}>{item}</MenuItem>})}
                    </Menu> 
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan = {4}>
                <label style = {{color:"white", fontWeight:"bold"}}>Provide description of defect:</label><br/>
                <textarea className = {classes.DefectTextArea} maxLength = {255} onBlur={(e)=>setFormDescription(e.target.value)}/>
                </TableCell>
            </TableRow> 
            <TableRow>
                <TableCell colSpan = {4}>
                    <label style = {{color:"white", fontWeight:"bold"}}>Make any comments:</label><br/>
                    <textarea className = {classes.DefectTextArea} maxLength = {255} onBlur={(e)=>setFormComment(e.target.value)}/>
                </TableCell>
            </TableRow>       
        </TableBody> 
        <TableFooter>
            <TableRow>
                <TableCell colSpan={2} align = "center"/>
                <TableCell align = "center">
                    <Button disabled={!checkFormValid()} className={classes.DefectFormButton} onClick={(event)=>handleSubmit(event)}>Submit Report</Button>
                </TableCell>
            </TableRow>
        </TableFooter>
        </Table>
        </TableContainer>
        </Modal>
    )
};