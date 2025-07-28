import Button from "@components/Button";
import { TextField } from "@mui/material";
import { useState } from "react";
import { useSendMessageMutation } from "../../services/messageApi";
import { useNotifications } from "../../hooks";
import { socket } from "../../context/SocketProvider";
import { Events } from "../../libs/constants";

const MessageCreation = ({ userId, messageEndRef }) => {
  const [newMessage, setNewMessage] = useState("");
  const [sendMessage] = useSendMessageMutation();
  const { createNotification } = useNotifications();
  const handleSubmit = async () => {
    const response = await sendMessage({
      message: newMessage,
      receiver: userId,
    }).unwrap();
    setNewMessage("");
    socket.emit(Events.CREATE_MESSAGE, response);

    createNotification({
      postId: null,
      notificationType: "MESSAGE",
      notificationTypeId: response._id,
      receiverUserId: userId,
    });
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };
  return (
    <div className="card flex gap-2 p-2">
      <TextField
        className="flex-1"
        size="small"
        placeholder="Type your message here"
        autoComplete="off"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <Button
        variant="contained"
        size="small"
        inputProps={{ disabled: !newMessage.trim() }}
        onClick={handleSubmit}
      >
        Send
      </Button>
    </div>
  );
};
export default MessageCreation;
