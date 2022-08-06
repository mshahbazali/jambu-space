/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Button } from "antd";
import { IoMdSend } from "react-icons/io";
import { toast } from "react-toastify";
import axios from "axios";
import { io } from "socket.io-client";
import ChatSidebar from "./ChatSidebar";
import Navbar from "../../Common/CustomNavbar/Index";
import Message from "./Message";
import { API_URL, SOCKET_URL, BASE_URL } from "../../utils/contants";
import "../../Stylesheet/Chat/chat.scss";
import { useNavigate, Link, useLocation } from "react-router-dom";

const ChatPage = () => {
  const location = useLocation();
  const inputRef = useRef(null);
  const sendBtnRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("authUser"));
  const [selected, setSelected] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [message, setMessage] = useState("");
  const socket = io.connect('http://localhost:5500');
  const receiverID = location?.state?.conversionId
  const [data, setData] = useState([])
  useEffect(() => {

  }, []);
  socket.emit("create-conversion", {
    receiverID,
    senderID: user._id
  });
  socket.on("created", (allData) => {
    setData([data, allData])
  });
  socket.on("recivedConversion", (data) => {
    setData(data)
  })
  socket.emit("get-messages-history", selected?._id)
  socket.on('output-messages', (result) => {
    setMessage(result)
  })
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          sendBtnRef.current.click();
        }
      });
    }
  }, [inputRef.current]);
  const handleNewMessageSend = () => {
    const receiverID = selected?.members.find(item => item !== user?._id);
    const data = {
      conversationID: selected?._id,
      sender: user?._id,
      text: newMessage,
      receiverID,
    }
    socket.emit("sendMessage", data)
    socket.emit("get-messages-history", selected?._id)

    socket.on('output-messages', (result) => {
      setMessage(result)
      setNewMessage("")
    })
    socket.on('message', (result) => {
      setMessage([...message, result])
      setNewMessage("")
    })
  }
  return (
    <>
      <Navbar />
      <Container fluid className="overflow-hidden chatWrapper">

        <Row className="h-100">
          <ChatSidebar setSelected={setSelected} data={data} />

          <Col className="px-0 main-chat">
            {selected ? (
              <Row
                className={`chat-message-content px-5 ${message.length > 7 ? "d-block" : "d-grid"
                  } align-content-end`}
              >
                {message
                  .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))
                  .map(msg => (
                    <div
                      key={message._id}
                      className={`msg-content d-inline-flex ${msg?.sender === user?._id ? "justify-content-end" : "justify-content-start"
                        } align-items-start h-auto`}
                    >
                      <div
                        className={`${msg?.sender === user?._id ? "here" : "there"
                          } my-2 d-flex flex-column p-2 text-white mw-75`}
                      >
                        <h6 className="mb-1 reciever color-primary">{msg?.name}</h6>
                        <p className="mb-0">{msg.text}</p>
                      </div>
                    </div>))}

                <Row className="msg-bottom-feild bg-appbar-light py-3 align-items-center justify-content-between d-none d-sm-flex">
                  <Col className="px-0" xs={10} sm={10} md={11}>
                    <input
                      className="form-control message-input-feild"
                      ref={inputRef}
                      placeholder="Type a message"
                      value={newMessage}
                      onChange={e => {
                        setNewMessage(e.target.value);
                      }}
                    />
                  </Col>

                  <Col className="px-0 text-center" xs={2} sm={2} md={1}>
                    <Button
                      ref={sendBtnRef}
                      type="link"
                      size="small"
                      onClick={handleNewMessageSend}
                    >
                      <IoMdSend
                        className="me-0 me-sm-0 me-md-2 me-lg-2 msg-send-btn"
                        color="#8696A0"
                        fontSize={22}
                      />
                    </Button>
                  </Col>
                </Row>
              </Row>
            ) : (
              <div className="defaultMessage">
                Select any message to see its chat
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ChatPage;
