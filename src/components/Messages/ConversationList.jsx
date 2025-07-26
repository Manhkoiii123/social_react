import { Link, useParams } from "react-router-dom";
import { useGetConversationsQuery } from "../../services/messageApi";
import { useUserInfo } from "../../hooks";
import classNames from "classnames";
import { Circle } from "@mui/icons-material";
import UserAvatar from "../UserAvatar";
import TimeAgo from "../TimeAgo";

const ConversationList = () => {
  const { data: conversations = [] } = useGetConversationsQuery();
  const { userId: activeUserId } = useParams();

  const { _id: currentUserId } = useUserInfo();
  return (
    <div className="card flex h-[calc(100vh-150px)] flex-col overflow-y-auto rounded-r-none p-0">
      {conversations.map((conversation) => {
        // ng mình đang nt với
        const partner =
          conversation.sender._id === currentUserId
            ? conversation.receiver
            : conversation.sender;
        const isActive = activeUserId === partner._id; // đang chọn cuộc trò chuyện này
        const isUnread =
          !conversation.seen && conversation.sender._id !== currentUserId;

        return (
          <Link to={`/messages/${partner._id}`} key={partner._id}>
            <div
              className={classNames(
                "relative flex items-center gap-2 px-4 py-2",
                {
                  "bg-primary-main text-white transition-all": isActive,
                },
              )}
            >
              <UserAvatar
                name={partner.fullName}
                src={partner.image}
                className={classNames({ "border-2 border-white": isActive })}
              />
              <div className="w-full">
                <div className="flex justify-between">
                  <p
                    className={classNames(
                      "font-semibold",
                      isUnread ? "font-extrabold" : "",
                    )}
                  >
                    {partner.fullName}
                  </p>
                  <TimeAgo
                    date={conversation.createdAt}
                    className={classNames("text-xs text-dark-400", {
                      "text-white": isActive,
                      "font-medium": isUnread,
                    })}
                  />
                </div>
                <p
                  className={classNames("text-sm text-dark-400", {
                    "text-white": isActive,
                    "font-medium text-black": isUnread,
                  })}
                >
                  {conversation.sender._id === currentUserId ? (
                    <span>You: </span>
                  ) : null}
                  {conversation.message}
                </p>
              </div>
              {isUnread && (
                <Circle className="absolute right-4 top-1/2 ml-1 !h-2 !w-2 text-primary-main" />
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ConversationList;
