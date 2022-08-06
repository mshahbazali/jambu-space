/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Input } from "antd";
import axios from "axios";
import { BiSearchAlt2 } from "react-icons/bi";
import Conversation from "./Conversation";
import { API_URL } from "../../utils/contants";
import "../../Stylesheet/Chat/chatSidebar.scss";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

const CustomSidebar = ({ setSelected, data }) => {
  const user = JSON.parse(localStorage.getItem("authUser"));
  const [conversations, setConversations] = useState([]);
  const socket = io.connect('http://localhost:5500');
  useEffect(() => {
    // socket.on("recivedConversion", (data) => {
    //   setConversations(data)
    // })
    // axios.get(API_URL + "conversations/" + user?._id)
    //   .then(res => {
    //     console.log(res.data)
    //     setConversations(res.data)
    //   }).catch((err) => {
    //     console.log(err)
    //   })
  }, []);

  return (
    <Col
      className="p-0 sidebar-full"
      style={{ width: "400px", height: "100%" }}
      xs={2}
      sm={2}
      md={3}
      lg={4}
    >
      <Link className="btn btn-info w-100" to="/pages/video-call">Video Call</Link>
      <Row className="py-2 bg-appbar-dark input-wrapper w-100 mx-0">
        <Col>
          <Input
            type="search"
            className="py-2 search-input border-0 rounded-pill"
            placeholder="Search or start a new chat"
            prefix={<BiSearchAlt2 fontSize={17} className="me-3 " />}
          />
        </Col>
      </Row>


      <Row className="chats-contacts">
        <Col className="chats-card w-100" xs={12} sm={12} md={12}>
          {data.map(item => (
            <Conversation
              conversation={item}
              myID={user?._id}
              setSelected={setSelected}
            />
          ))}
        </Col>
      </Row>
    </Col>
  );
};

export default CustomSidebar;
