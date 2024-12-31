import React, { useEffect, useState, useRef } from "react";
import { MdSend } from "react-icons/md"; // Import the MdSend icon from React Icons
import axios from "axios";
import io from "socket.io-client";
import {useNavigate} from "react-router-dom"

const ChatPage = () => {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    if(localStorage.getItem("userId")===null){
     navigate("/Login")

    }
    const getUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/getOtherUser",
          { withCredentials: true }
        );
        const filterUser = response.data.filter(
          (user) => user._id !== localStorage.getItem("userId")
        );
        setUsers(filterUser);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    // Initialize socket connection
    socket.current = io("http://localhost:5000");
    socket.current.emit("addUser", localStorage.getItem("userId"));

    // Handle incoming messages
    socket.current.on("getMessage", (data) => {
      const { receiverId, message, userId } = data;

      if (selectedUser && userId === selectedUser._id) {
        setMessages((prev) => [
          ...prev,
          {
            sender_id: userId, // Match the structure used in rendering
            receiver_id: receiverId,
            message: message,
          },
        ]);
      }
    });

    getUsers();
  }, [selectedUser]);

  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/message/getMessages/${user._id}`,
        { withCredentials: true }
      );
      setMessages(res.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !selectedUser) return;

    // Emit message via socket
    socket.current.emit("sendMessage", {
      receiverId: selectedUser._id,
      message: newMessage,
      userId: localStorage.getItem("userId"),
    });

    // Update local message state
    setMessages((prev) => [
      ...prev,
      {
        sender_id: localStorage.getItem("userId"),
        receiver_id: selectedUser._id,
        message: newMessage,
      },
    ]);
    setNewMessage("");

    // Send message to backend
    try {
      await axios.post(
        `http://localhost:5000/api/message/sendMessage/${selectedUser._id}`,
        { message: newMessage },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Sidebar */}
      <div className="w-full md:w-1/4 bg-gray-800 text-white p-4 md:p-6">
        <div className="mb-4">
          <input
            type="text"
            className="w-full p-2 rounded-md bg-gray-700 text-white"
            placeholder="Search for a user"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="space-y-4">
          {users
            .filter((user) =>
              user.fullname.toLowerCase().includes(search.toLowerCase())
            )
            .map((user) => (
              <div
                key={user._id}
                className="flex items-center cursor-pointer hover:bg-gray-700 p-2 rounded-md"
                onClick={() => handleUserClick(user)}
              >
                <img
                  src={user.profilephoto}
                  alt={user.fullname}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <span>{user.fullname}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Right Chat Section */}
      <div className="w-full md:w-3/4 bg-gray-50 p-4 md:p-6">
        {selectedUser ? (
          <>
            <div className="mb-6">
              <div className="flex items-center">
                <img
                  src={selectedUser.profilephoto}
                  alt={selectedUser.fullname}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <span className="text-xl font-semibold">
                  {selectedUser.fullname}
                </span>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md h-[50vh] md:h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                {messages
                  .filter(
                    (msg) =>
                      (msg.sender_id === localStorage.getItem("userId") &&
                        msg.receiver_id === selectedUser._id) ||
                      (msg.sender_id === selectedUser._id &&
                        msg.receiver_id === localStorage.getItem("userId"))
                  )
                  .map((msg, index) => (
                    <div
                      key={index}
                      className={`flex items-center ${
                        msg.sender_id === localStorage.getItem("userId")
                          ? "justify-end"
                          : ""
                      }`}
                    >
                      <div
                        className={`${
                          msg.sender_id === localStorage.getItem("userId")
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300"
                        } p-2 rounded-lg max-w-xs`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="mt-4 flex">
              <input
                type="text"
                placeholder="Type a message"
                className="w-full p-2 rounded-l-md border-2 border-gray-300"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white p-2 rounded-r-md"
                onClick={handleSendMessage}
              >
                <MdSend className="h-6 w-6" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">
            <p>Select a user to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
