import { Delete } from "@mui/icons-material";
import { Card, CardContent, CardMedia, Chip, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import axios from "axios";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CustomNavbar from "../../Common/CustomNavbar/Index";
import { API_URL, BASE_URL , ADMIN_API_All_JOBS} from "../../utils/contants";
import { toast } from "react-toastify";


const AllJobs = () => {
    const navigate = useNavigate();
    const adminUser = JSON.parse(localStorage.getItem('authUser'));
    const userType = localStorage.getItem('userType');

    useEffect(() => { 
        if (userType !== 'admin')
            navigate('/login')
    }, [])

    const [showAllPostings, setShowAllPostings] = useState(false);
    const [postings, setPostings] = useState([]);
    const toggleShowPostings = () => setShowAllPostings(!showAllPostings);

    useEffect(() => {
        axios
          .get( ADMIN_API_All_JOBS)
          .then(res => setPostings(res.data))
          .then(err => console.log(err));
      }, []);
      const deleteJob = useCallback(async (job) => {
        axios.delete(API_URL + `jobs/${job._id}`).then((response) => {
          toast('Job Deleted Successfully')
          axios
            .get( ADMIN_API_All_JOBS)
            .then(res => setPostings(res.data))
            .then(err => console.log(err));
        })
          .catch((error) => {
            toast('There was an error while deleting job')
            console.log('error while deleting job :', error)
          })
      }, [])
    
    return (
        <div>
             <CustomNavbar />
            <h3 className="text-center mt-4">All Jobs</h3> 
            <Row className="my-4">
          <Col xs={12} sm={12} md={12} >
            <div className="card shadow border-radius mb-4">
              <div className="card-head d-flex justify-content-between border-bottom p-3">
                <p
                  className="mb-0 txt-primary cursor-pointer"
                  onClick={toggleShowPostings}
                >
                  See {showAllPostings ? "Less" : "All"} Postings
                </p>
              </div>

              <div className="card-body p-3">
                <Grid container spacing={3}>
                  {
                    postings.length > 0 ? (
                      showAllPostings ? (
                        postings.map((item, idx) => {
                          return (
                            <Grid item xs={12} md={3} >
                              <Card key={idx} sx={{ maxWidth: 345 }}>
                                <CardMedia
                                  component="img"
                                  height="140"
                                  image={BASE_URL + item?.image?.url}

                                />
                                <CardContent>
                                  <Tooltip title={item.title}>
                                    <Typography gutterBottom variant="h6" component="div" noWrap >
                                      {item.title}
                                    </Typography>
                                  </Tooltip>
                                  <Tooltip title={item.description}>
                                    <Typography variant="body2" noWrap >
                                      {item.description}
                                    </Typography>
                                  </Tooltip>
                                  <Typography variant="body2" marginTop={1} noWrap >
                                    Budget: {item.budget}$
                                  </Typography>
                                  <Tooltip title={item.customerID}>
                                  <Typography variant="body2" marginTop={1} noWrap >
                                  CustomerID: {item.customerID}
                                  </Typography>
                                  </Tooltip>
                                  <Typography variant="body2" marginTop={1} noWrap >
                                  Duration: {item.duration}
                                  </Typography>
                                  <Typography variant="body2" marginTop={1} noWrap >
                                  ExperienceLevel: {item.experienceLevel}
                                  </Typography>
                                  <Typography variant="body2" marginTop={1} noWrap >
                                  Hours Needed: {item.hoursNeeded}
                                  </Typography>
                                  <Tooltip title={item.technologies}>
                                  <Typography variant="body2" marginTop={1} noWrap >
                                  Technologies: {item.technologies}
                                  </Typography>
                                  </Tooltip>
                                  <Typography variant="body2" marginTop={1} noWrap >
                                  Updated At: {item.updatedAt}
                                  </Typography>
                                  <Stack direction="row" marginTop={2} style={{ display: 'flex', justifyContent: 'space-between' }} >
                                    <IconButton onClick={() => deleteJob(item)}>
                                      <Delete />
                                    </IconButton>
                                  </Stack>
                                </CardContent>



                              </Card>
                            </Grid>
                          )
                        })
                      ) : (
                        <Grid item xs={12} md={4} >
                          <Card sx={{ maxWidth: 345 }}>
                            <CardMedia
                              component="img"
                              height="140"
                              image={BASE_URL + postings[postings.length - 1]?.image?.url}
                            />
                            <CardContent>
                              <Tooltip title={postings[postings.length - 1]?.title}>
                                <Typography gutterBottom variant="h6" component="div" noWrap >
                                  {postings[postings.length - 1]?.title}
                                </Typography>
                              </Tooltip>
                              <Tooltip title={postings[postings.length - 1]?.description}>
                                <Typography variant="body2" noWrap >
                                  {postings[postings.length - 1]?.description}
                                </Typography>
                              </Tooltip>
                              <Typography variant="body2" marginTop={1} noWrap >
                                Budget: {postings[postings.length - 1]?.budget}$
                              </Typography>
                              <Stack direction="row" marginTop={2} style={{ display: 'flex', justifyContent: 'space-between' }} >
                                <Chip label={postings[postings.length - 1]?.status} color={postings[postings.length - 1]?.status === "pending" ? "info" : "error"} />
                                <IconButton onClick={() => deleteJob(postings[postings.length - 1])}>
                                  <Delete />
                                </IconButton>
                              </Stack>
                            </CardContent>


                          </Card>
                        </Grid>
                      )) : <Typography variant="body1" marginX={3} marginTop={2}>You Haven't Posted Any Job Yet</Typography>}
                </Grid>
              </div>
            </div>
          
          </Col>
        </Row>
           
        </div>
    );
}

export default AllJobs;
