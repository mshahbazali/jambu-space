import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomNavbar from '../../Common/CustomNavbar/Index';
import { ADMIN_API_URL } from "../../utils/contants";


const CompanyMargin = () => {
    const navigate = useNavigate();
    const userType = localStorage.getItem('userType');

    useEffect(() => {
        if (userType !== 'admin')
            navigate('/login')
    }, [])


    const defaultValues = {
        margin: "",
    };

    const [formValues, setFormValues] = useState(defaultValues);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        axios
            .put(ADMIN_API_URL + "companyMargin", formValues)
            .then(response => {
                toast('Company Margin Updated Successfully')
                setFormValues({ margin: '' })
            })
            .catch(error => {
                toast('Unable to update company margin')
            });
    };

    const validate = () => {
        if (formValues.margin !== '')
            return false
        else return true
    }

    return (
        <div>
            <CustomNavbar />
            <h3 className="mt-5" style={{ textAlign: 'center' }}>Change Jambu Space Percentage</h3>
            <form onSubmit={handleSubmit}>
                <Grid container alignItems="center" justifyContent="center" direction="column" style={{ backgroundColor: 'white', marginTop: '7rem' }} >
                    <Grid item style={{ padding: '15px' }}>
                        <TextField
                            id="age-input"
                            name="margin"
                            label="Margin Percentage"
                            type="text"
                            value={formValues.margin}
                            onChange={handleInputChange}
                        />
                    </Grid>

                    <Button variant="contained" color="primary" type="submit" style={{ marginTop: '25px' }} disabled={validate()}>
                        Submit
                    </Button>
                </Grid>
            </form>
        </div>
    );
}

export default CompanyMargin;
