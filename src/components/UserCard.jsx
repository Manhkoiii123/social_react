import { Check, Close, MessageOutlined, PersonAdd, PersonRemove } from "@mui/icons-material";
import { Avatar, Button, CircularProgress } from "@mui/material";

import { Link } from "react-router-dom";
import { socket } from "@context/SocketProvider";
import MyButton from "@components/Button";
import {
  useAcceptFriendRequestMutation,
  useCancelFriendRequestMutation,
  useSendFriendRequestMutation,
} from "@services/friendApi";
import { Events } from "@libs/constants";
export function UserActionButtons({
  userId,
  isFriend,
  requestSent,
  requestReceived,
}) {
  const [sendFriendRequest, { isLoading: isAddingFriend }] =
    useSendFriendRequestMutation();
  const [acceptFriendRequest, { isLoading: isAccepting }] =
    useAcceptFriendRequestMutation();
  const [cancelFriendRequest, { isLoading: isCanceling }] =
    useCancelFriendRequestMutation();

  if (isFriend) {
    return (
      <div className="mt-2 space-x-1">
        <MyButton variant="outlined" size="small">
          <PersonRemove className="mr-1" fontSize="small" /> Unfriend
        </MyButton>
        <MyButton variant="contained" size="small">
          <MessageOutlined className="mr-1" fontSize="small" /> Message
        </MyButton>
      </div>
    );
  }

  if (requestSent) {
    return (
      <MyButton variant="contained" size="small" disabled>
        <Check className="mr-1" fontSize="small" /> Request Sent
      </MyButton>
    );
  }

  if (requestReceived) {
    return (
      <div className="mt-2 space-x-1">
        <MyButton
          variant="contained"
          size="small"
          onClick={() => acceptFriendRequest(userId)}
          icon={<Check className="mr-1" fontSize="small" />}
          isLoading={isAccepting}
        >
          Accept
        </MyButton>

        <MyButton
          variant="outlined"
          size="small"
          onClick={() => cancelFriendRequest(userId)}
          icon={<Close className="mr-1" fontSize="small" />}
          isLoading={isCanceling}
        >
          Cancel
        </MyButton>
      </div>
    );
  }

  return (
    <MyButton
      variant="outlined"
      onClick={async () => {
        await sendFriendRequest(userId).unwrap();
        socket.emit(Events.FRIEND_REQUEST_SENT, {
          receiverId: userId,
        });
      }}
      disabled={isAddingFriend}
    >
      {isAddingFriend ? (
        <CircularProgress className="mr-1 animate-spin" size="16px" />
      ) : (
        <PersonAdd className="mr-1" fontSize="small" />
      )}{" "}
      Add Friend
    </MyButton>
  );
}
const UserCard = ({
  id,
  isFriend,
  fullName = "",
  requestSent,
  requestReceived,
}) => {
  const [sendFriendRequest, { isLoading }] = useSendFriendRequestMutation();
  const [acceptFriendRequest, { isLoading: isAccepting }] =
    useAcceptFriendRequestMutation();
  const [cancelFriendRequest, { isLoading: isCanceling }] =
    useCancelFriendRequestMutation();

  function getActionButtons() {
    if (isFriend) {
      return (
        <Button variant="contained" size="small">
          <MessageOutlined className="mr-1" fontSize="small" /> Message
        </Button>
      );
    }

    if (requestSent) {
      return (
        <Button variant="contained" size="small" disabled>
          <Check className="mr-1" fontSize="small" /> Request Sent
        </Button>
      );
    }

    if (requestReceived) {
      return (
        <div className="mt-2 space-x-1">
          <MyButton
            variant="contained"
            size="small"
            onClick={() => acceptFriendRequest(id)}
            icon={<Check className="mr-1" fontSize="small" />}
            isLoading={isAccepting}
          >
            Accept
          </MyButton>

          <MyButton
            variant="outlined"
            size="small"
            onClick={() => cancelFriendRequest(id)}
            icon={<Close className="mr-1" fontSize="small" />}
            isLoading={isCanceling}
          >
            Cancel
          </MyButton>
        </div>
      );
    }

    return (
      <Button
        variant="outlined"
        onClick={async () => {
          await sendFriendRequest(id).unwrap();
          /**
           * code be
           * socket.on(Events.FRIEND_REQUEST_SENT, (data) => {
    const receiverId = data.receiverId;
    const receiver = users[receiverId];

    if (receiver) {
        // Emit to receiver
        io.to(receiver.socketId).emit(Events.FRIEND_REQUEST_RECEIVED, {
            from: socket.authUser._id,
            fullName: socket.authUser.fullName,
            image: socket.authUser.image,
            imagePublicId: socket.authUser.imagePublicId
        });
    }
});
           */
          // ng dùng có cái id này là ng nhận được lời mới kết bạn
          socket.emit("friendRequestSent", {
            receiverId: id,
          });
        }}
        disabled={isLoading}
      >
        {isLoading ? (
          <CircularProgress className="mr-1 animate-spin" size="16px" />
        ) : (
          <PersonAdd className="mr-1" fontSize="small" />
        )}{" "}
        Add Friend
      </Button>
    );
  }

  return (
    <div className="card flex flex-col items-center">
      <Avatar className="mb-3 !h-12 !w-12 !bg-primary-main">
        {fullName[0]?.toUpperCase()}
      </Avatar>
      <Link>
        <p className="text-lg font-bold">{fullName}</p>
      </Link>
      <div className="mt-4">{getActionButtons()}</div>
    </div>
  );
};
export default UserCard;
