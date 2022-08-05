import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomNavbar from '../../Common/CustomNavbar/Index';
import { ADMIN_API_URL } from "../../utils/contants";


const AdminPanalHome = () => {
    const navigate = useNavigate();

    const adminUser = JSON.parse(localStorage.getItem('authUser'));
    const userType = localStorage.getItem('userType');

    useEffect(() => {
        if (userType !== 'admin')
            navigate('/login')
    }, [])




    const defaultValues = {
        // email: adminUser?.email,
        email: '',
        password: '',
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
            .put(ADMIN_API_URL + `updateProfile/${adminUser?._id}`, formValues)
            .then(response => {
                toast('Profile Updated Successfully')
                setFormValues({ email: adminUser?.email, password: '' })
            })
            .catch(error => {
                toast('Unable To Update Profile')
            });
    };

    const validate = () => {
        if (formValues.password !== '')
            return false
        else return true
    }

    return (
        <div>
            <CustomNavbar />
            <h3 className="mt-5" style={{ textAlign: 'center' }}>Edit Profile</h3>
            <form onSubmit={handleSubmit}>
                <Grid container alignItems="center" justify="center" direction="column" style={{ backgroundColor: 'white', marginTop: '7rem' }} >
                    <Grid item style={{ padding: '15px' }}>
                        <TextField
                            id="name-input"
                            name="email"
                            label="Email"
                            type="text"
                            value={formValues.email}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item style={{ padding: '15px' }}>
                        <TextField
                            id="age-input"
                            name="password"
                            label="Password"
                            type="password"
                            value={formValues.password}
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

export default AdminPanalHome;
