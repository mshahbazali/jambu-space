/* eslint-disable react-hooks/exhaustive-deps */
import { Delete } from "@mui/icons-material";
import { Card, CardContent, CardHeader, CardMedia, Chip, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import axios from "axios";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate , Link } from "react-router-dom";
import CustomButton from "../../Common/Button/CustomButton";
import CustomNavbar from "../../Common/CustomNavbar/Index";
import CustomFooter from "../../Shared/Footer/CustomFooter";
import "../../Stylesheet/Dashboard/dashboard.scss";
import { API_URL, BASE_URL, SELLER_API_URL } from "../../utils/contants";
import { toast } from "react-toastify";

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("authUser"));
  const userType = localStorage.getItem("userType");
  const [showAllPostings, setShowAllPostings] = useState(false);
  const [postings, setPostings] = useState([]);
  const isSeller = userType === "seller";
  const [userTyp, setUserTyp] = useState(userType)

  const toggleShowPostings = () => setShowAllPostings(!showAllPostings);


  const getBids = () => {

    userType === "seller" && axios.get(SELLER_API_URL + "bids/get/" + user?._id)
      .then(async (res) => {
        await setPostings(res.data)
      })
  }

  useEffect(() => {
    axios
      .get(API_URL + `auth/${user?._id}/jobs`)
      .then(res => {
        setPostings(res.data)
      })
      .then(err => console.log(err));
    getBids()

  }, []);

  console.log("postings", postings)

  const deleteJob = useCallback(async (job) => {
    axios.delete(API_URL + `jobs/${job._id}`).then((response) => {
      toast('Job Deleted Successfully')
      axios
        .get(API_URL + `auth/${user?._id}/jobs`)
        .then(res => setPostings(res.data))
        .then(err => console.log(err));
    })
      .catch((error) => {
        toast('There was an error while deleting job')
        console.log('error while deleting job :', error)
      })
  }, [])


  const deleteProposal = (v) => {
    axios.delete(SELLER_API_URL + "bids/delete/" + v._id)
      .then(() => {
        toast("Deleted Successfully")
        getBids()
      })
      .catch((e) => {
        alert("Error occured")
      })
  }

  return (
    <>
      <CustomNavbar />
      <Container className="container-2 ">
        <Row>
          <Col xs={12} sm={12} md={6} lg={6}  >
            <Typography variant="h4" component="div">
              {userTyp === "seller" ? "Seller" : "Customer"} Dashboard
            </Typography>
          </Col>
          <Col
            xs={12}
            sm={12}
            md={6}
            lg={6}
            className="d-flex align-items-center justify-content-between justify-content-sm-between justify-content-md-end justify-content-lg-end"
          >
            {userTyp !== "seller" && (
              <CustomButton
                type="primary"
                values="Post a Job"
                onClick={() => navigate("/pages/post-job")}
              />
            )}
          </Col>
        </Row>

        <Row className="my-4">
          <Col xs={12} sm={12} md={8}>
            <div className="card shadow border-radius mb-4">
              <div className="card-head d-flex justify-content-between border-bottom p-3">
                <Typography variant="h5">Your Postings</Typography>
                <p
                  className="mb-0 txt-primary cursor-pointer"
                  onClick={toggleShowPostings}
                >
                  See {showAllPostings ? "Less" : "All"} Postings
                </p>
              </div>

              <div className="card-body p-3">
                <Grid container spacing={3}>
                  {userTyp !== "seller" ? postings.length > 0 ? (
                    showAllPostings ? (
                      postings.map((item, idx) => {
                        return (
                          <Grid item xs={12} md={4} >
                            <Link to="/jobs/details" state={{ job: item }} >
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
                                  <Stack direction="row" marginTop={2} style={{ display: 'flex', justifyContent: 'space-between' }} >
                                    <Chip label={item?.status} color={item?.status === "pending" ? "info" : "error"} />
                                    <IconButton onClick={() => deleteJob(item)}>
                                      <Delete />
                                    </IconButton>
                                  </Stack>
                                </CardContent>



                              </Card></Link>
                          </Grid>
                        )
                      })
                    ) : (
                      <Grid item xs={12} md={4} >
                        <Link to="/jobs/details" state={{ job: postings[postings.length - 1] }} >
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


                        </Card></Link>
                      </Grid>
                    )) : <Typography variant="body1" marginX={3} marginTop={2}>You Haven't Posted Any Job Yet</Typography> :
                    postings.length > 0 ? (
                      showAllPostings ? (
                        postings.map((item, idx) => {
                          return (
                            <Grid item xs={12} md={4} >
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
                                    Budget: {item.amount}$
                                  </Typography>
                                  <Stack direction="row" marginTop={2} style={{ display: 'flex', justifyContent: 'space-between' }} >
                                    <Chip label={item?.status} color={item?.status === "pending" ? "info" : "error"} />
                                    <IconButton onClick={() => deleteProposal(item)}>
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
                                Budget: {postings[postings.length - 1]?.amount}$
                              </Typography>
                              <Stack direction="row" marginTop={2} style={{ display: 'flex', justifyContent: 'space-between' }} >
                                <Chip label={postings[postings.length - 1]?.status} color={postings[postings.length - 1]?.status === "pending" ? "info" : "error"} />
                                <IconButton onClick={() => deleteProposal(postings[postings.length - 1])}>
                                  <Delete />
                                </IconButton>
                              </Stack>
                            </CardContent>


                          </Card>
                        </Grid>
                      )) : <Typography variant="body1" marginX={3} marginTop={2}>You Haven't Posted Any Proposal Yet</Typography>
                  }
                </Grid>
              </div>
            </div>
            <div className="card shadow border-radius mb-4">
              <div className="card-head d-flex justify-content-between border-bottom p-3">
                <Typography variant="h5">Your Drafts</Typography>
                <p className="mb-0 txt-primary">See All Drafts</p>
              </div>
              <div className="card-body p-3"><Typography variant="body2">No Drafts</Typography></div>
            </div>
          </Col>
          <Col xs={12} sm={12} md={4} lg={4}>
            <div className="card shadow border-radius">
              <div className="card-head d-flex justify-content-between border-bottom p-3">
                <Typography variant="h5">Ready To Buy Projects</Typography>
              </div>
              <div className="p-3">
                <Typography variant="body1">Know What You Need But Not How To Get It Done? Buy A Project Priced & Scoped By A Pro To Start Working Right Away</Typography>
                <Typography style={{ fontWeight: "bold" }}>We Think You Might Like Help With</Typography>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <CustomFooter />
    </>
  );
};

export default DashboardPage;
