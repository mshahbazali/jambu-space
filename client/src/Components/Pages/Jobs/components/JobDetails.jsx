import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from "react-router-dom";
import CustomNavbar from '../../../Common/CustomNavbar/Index';
import CustomFooter from '../../../Shared/Footer/CustomFooter';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { ADMIN_API_URL, SELLER_API_URL } from '../../../utils/contants';
import axios from 'axios';

const JobDetails = () => {
    const location = useLocation();
    const selectedJob = location?.state.job;
    const [jumboSpaceCharges, setJumboSpaceCharges] = useState(null);
    const [applied, setApplied] = useState(false)
    var user = JSON.parse(localStorage.getItem("authUser"));
    const userType = localStorage.getItem("userType");
    const [proposals, setProposals] = useState([])
    const [months, setMonths] = useState(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"])

    useEffect(() => {
        document.title = `Jambu Space ( Job Details )`

    })

    useEffect(() => {
        axios
            .get(ADMIN_API_URL + "companyMargin").then((response => {
                setJumboSpaceCharges(response.data[0].margin)
            })).catch(error => {
                console.log('error retreiving company margin :', error)
            })

        axios.get(SELLER_API_URL + "bids/getbids/" + selectedJob._id,)
            .then(async (res) => {
                console.log(res.data, "res")
                setProposals(res.data)
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].sellerID === user._id) {
                        setApplied(true)

                    }
                }
            })


    }, [])
    return (
        <div>
            <CustomNavbar />
            <div className='container mt-4'>
                <div className='row'>
                    <div className='col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12 '>
                        <div>
                            <p className='job-details-title mb-0 pb-0'>{selectedJob?.title}</p>

                        </div>
                        <hr />
                        <div>
                            {/* <p>The application of our company needs several freelancers to test and use and give feedback. They work about 2 hours a day and the salary is 30 DOLLARS per hour. If you are interested, please contact me as soon as possible</p> */}
                            <p>{selectedJob?.description}</p>
                        </div>
                        <hr />
                        <div className='row p-3'>
                            <div className='col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6'>
                                <div className='row'>
                                    <div className='col-1 pt-3'>
                                        <AccessTimeIcon style={{ fontSize: "17px" }} />
                                    </div>
                                    <div className='col-8 pt-1'>
                                        <p className="fw-bold details-p">{selectedJob?.hoursNeeded}</p>
                                    </div>
                                    <div className='row'>
                                        <div className='col-1'></div>
                                        <div className='col-8 text-muted'>
                                            Hourly
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className='col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6'>
                                <div className='row'>
                                    <div className='col-1 pt-3'>
                                        <CalendarMonthIcon style={{ fontSize: "17px" }} />
                                    </div>
                                    <div className='col-8 pt-1'>
                                        <p className="fw-bold details-p">{selectedJob?.duration}</p>
                                    </div>
                                    <div className='row'>
                                        <div className='col-1'></div>
                                        <div className='col-8 text-muted'>
                                            Duration
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className='col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6'>
                                <div className='row'>
                                    <div className='col-1 pt-3'>
                                        <PsychologyIcon style={{ fontSize: "17px" }} />
                                    </div>
                                    <div className='col-8 pt-1'>
                                        <p className="fw-bold details-p">{selectedJob?.experienceLevel}</p>
                                    </div>
                                    <div className='row'>
                                        <div className='col-1'></div>
                                        <div className='col-8 text-muted'>
                                            Experience Level
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className='col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6'>
                                <div className='row'>
                                    <div className='col-1 pt-3'>
                                        <AddLocationIcon style={{ fontSize: "17px" }} />
                                    </div>
                                    <div className='col-8 pt-1'>
                                        <p className="fw-bold details-p-2">Remote Job</p>
                                    </div>
                                    {/* <div className='row'>
                               <div className='col-1'></div>
                               <div className='col-8 text-muted'>
                               Experience Level
                               </div>
                           </div>              */}
                                </div>
                            </div>

                            <div className='col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6'>
                                <div className='row'>
                                    <div className='col-1 pt-3'>
                                        <WorkIcon style={{ fontSize: "17px" }} />
                                    </div>
                                    <div className='col-8 pt-1'>
                                        <p className="fw-bold details-p"> One-time project</p>
                                    </div>
                                    <div className='row'>
                                        <div className='col-1'></div>
                                        <div className='col-8 text-muted'>
                                            Project Type
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className='col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6'>
                                <div className='row'>
                                    <div className='col-1 pt-3'>
                                        <AttachMoneyIcon style={{ fontSize: "17px" }} />
                                    </div>
                                    <div className='col-8 pt-1'>
                                        <p className="fw-bold details-p">{selectedJob?.budget}</p>
                                    </div>
                                    <div className='row'>
                                        <div className='col-1'></div>
                                        <div className='col-8 text-muted'>
                                            Budget
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <hr className='mt-4' />

                            <div className='mt-3 mb-3'>
                                <h4>Skills and Expertise</h4>
                                <div className="mt-1">
                                    {selectedJob?.technologies.map(technology => (<Chip key={`unique${technology}`} className="chip-jobs" label={technology} />))}
                                </div>
                            </div>
                            <hr className='mt-4' />

                            {userType === "seller" ? <div>
                                <div>
                                    <h4>About Client</h4>
                                    <div className='row'>
                                        <div className='col-1'>
                                            <Avatar sx={{ width: 55, height: 55 }} alt="Remy Sharp" src="https://www.w3schools.com/howto/img_avatar.png" />
                                        </div>
                                        <h5 className='col-11 mt-4 px-3 fw-normal text-dark'>{selectedJob?.customer?.fullName}</h5>
                                    </div>
                                </div>


                                <hr className='mt-4' />
                                <div className=''>
                                    {applied == true ?
                                        <button style={{ backgroundColor: "#003D69" }} className='btn text-light  btn-md rounded-pill mb-4 mt-3' >Applied</button>
                                        : <Link style={{ backgroundColor: "#003D69" }} className='btn text-light  btn-md rounded-pill mb-4 mt-3' to="/job/submitproposal" state={{ selectedJob: selectedJob, jumboSpaceCharges: jumboSpaceCharges }} >Apply Now</Link>}
                                </div>
                            </div> : null}
                            <Link style={{ backgroundColor: "#003D69" }} className='btn text-light  btn-md rounded-pill mb-4 mt-3' to="/pages/chat" state={{ conversionId: selectedJob?.customer?._id }} >Chat</Link>

                            {userType === "customer" ?
                                <div>
                                    <h4>Proposals</h4>

                                    {proposals ? proposals.map((v, i) => {
                                        const date = new Date("2022-08-04T16:09:02.414Z")
                                        return (
                                            <div className='card p-3' key={i}>
                                                <div className="d-flex w-100">
                                                    <div className='w-75 '>
                                                        <h4 >
                                                            {v.seller.fullName}
                                                        </h4>
                                                    </div>
                                                    <div className='w-25 d-flex justify-content-end'>
                                                        <h4 >
                                                            ${v._doc.amount}
                                                        </h4>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p>
                                                        {v._doc.cover}
                                                    </p>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='w-75'>
                                                        <div>
                                                            Created at {`${months[date.getMonth()]} ${date.getDate()}  `}
                                                        </div>
                                                        <div>
                                                            {`${date.getHours() > 12 ? date.getHours() - 12 : date.getHours()} : ${date.getMinutes()} ${date.getHours() > 12 ? "PM" : "AM"}`}
                                                        </div>
                                                    </div>
                                                    <div className='w-25 d-flex align-items-end justify-content-end'>

                                                        <h6>From:
                                                            {v.seller.country}
                                                        </h6>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }) : null}
                                </div>
                                : null}









                        </div>
                    </div>
                    <div className='col-xl-4 col-lg-4 col-md-0 col-sm-0 col-0 login-form-column mt-3'>
                        <div className=' mt-5  p-5 job-section-signup'>
                            <h4 className='text-light'>Create a free profile to find work like this</h4>
                            <p className=' text-light'>What are you waiting for register now to apply to a Job!</p>
                            <Link style={{ backgroundColor: "#003D69" }} to="/signup" className='btn text-light  btn-md w-100  mt-3' >Sign Up</Link>

                        </div>


                    </div>

                </div>
            </div>





            <CustomFooter />

        </div>
    );
}

export default JobDetails;
