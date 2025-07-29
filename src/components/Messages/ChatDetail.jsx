import { useParams } from "react-router-dom";
import {
  useGetMessagesQuery,
  useMarkConversationAsSeenMutation,
} from "../../services/messageApi";
import { useUserInfo } from "../../hooks";
import dayjs from "dayjs";
import classNames from "classnames";
import MessageCreation from "./MessageCreation";
import { useRef } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { useGetUserInfoByIdQuery } from "../../services/userApi";
import UserAvatar from "../UserAvatar";
import { IconButton } from "@mui/material";
import { Videocam } from "@mui/icons-material";
import { useState } from "react";
import VideoCallRoom from "../VideoCall/VideoCallRoom";

const ChatDetail = () => {
  const { userId } = useParams();
  const messageEndRef = useRef();
  const [isInCall, setIsInCall] = useState(false);
  const { _id: currentUserId } = useUserInfo();
  const { data: partnerInfo } = useGetUserInfoByIdQuery(userId); // thông tin ng nhắn cùng mình
  const { data = { messages: [], pagination: {} } } = useGetMessagesQuery({
    userId,
    offset: 0,
    limit: 100,
  });
  const [markConversationAsSeen] = useMarkConversationAsSeenMutation();
  useEffect(() => {
    if (userId) {
      markConversationAsSeen(userId);
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [markConversationAsSeen, userId]);

  const getGroupedMessages = (messages) => {
    // nhóm theo ngày
    const groupedByDate = messages.reduce((groups, msg) => {
      const date = dayjs(msg.createdAt).format("MM-DD-YYYY");

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(msg);
      return groups;
    }, {});

    const fullyGrouped = {};
    // phút
    Object.entries(groupedByDate).forEach(([date, dateMessages]) => {
      fullyGrouped[date] = [];
      let groupedByMinutues = null;

      dateMessages.forEach((msg) => {
        const messageTime = dayjs(msg.createdAt);
        if (
          !groupedByMinutues ||
          groupedByMinutues.senderId !== msg.sender._id ||
          messageTime.diff(dayjs(groupedByMinutues.endTime), "minute") > 2
        ) {
          groupedByMinutues = {
            senderId: msg.sender._id,
            startTime: msg.createdAt,
            endTime: msg.createdAt,
            messages: [msg],
          };
          fullyGrouped[date].push(groupedByMinutues);
        } else {
          groupedByMinutues.messages.push(msg);
          groupedByMinutues.endTime = msg.createdAt;
        }
      });
    });

    return fullyGrouped;
  };

  const groupedMessages = useMemo(() => {
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);

    return getGroupedMessages(data.messages);
  }, [data.messages]);

  const handleStartCall = () => {
    setIsInCall(true);
  };

  return (
    <div className="card bg-dark-600 flex h-[calc(100vh-150px)] flex-col rounded-l-none pt-0">
      {partnerInfo && (
        <div className="-mx-4 flex justify-between border-b border-dark-300 bg-white px-7 py-3 shadow">
          <div className="flex items-center">
            <UserAvatar name={partnerInfo.fullName} src={partnerInfo.image} />
            <p className="ml-3 font-medium">{partnerInfo.fullName}</p>
          </div>
          <IconButton onClick={handleStartCall}>
            <Videocam />
          </IconButton>
        </div>
      )}
      <div className="flex max-h-[calc(100%-65px)] flex-1 flex-col justify-between">
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto pb-6 pt-4">
          {Object.entries(groupedMessages).map(([date, groupsByMinutes]) => {
            return (
              <div key={date}>
                <div className="mb-2 flex justify-center">
                  <p className="text-dark-500 rounded-full bg-dark-100 px-3 py-1 text-xs">
                    {dayjs(date).format("MMMM D, YYYY")}
                  </p>
                </div>
                <div className="space-y-2">
                  {groupsByMinutes.map((group) => {
                    return (
                      <div key={group.startTime} className="space-y-0.5">
                        {group.messages.map((msg, index) => {
                          const isLastIndex =
                            index === group.messages.length - 1;
                          const isOwn = msg.sender._id === currentUserId;

                          return (
                            <div
                              key={msg._id}
                              className={classNames(
                                "flex",
                                isOwn ? "justify-end" : "justify-start",
                              )}
                            >
                              <div
                                className={classNames(
                                  "max-w-[70%] rounded-lg px-4 py-2",
                                  isOwn
                                    ? "rounded-tr-none bg-primary-main text-white"
                                    : "rounded-tl-none bg-white shadow",
                                )}
                              >
                                <p>{msg.message}</p>
                                {isLastIndex && (
                                  <p
                                    className={classNames(
                                      "mt-1 text-right text-xs",
                                      isOwn ? "text-white/80" : "text-dark-400",
                                    )}
                                  >
                                    {dayjs(msg.createdAt).format("HH:mm")}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div id="Testing" ref={messageEndRef} />
        </div>
        <MessageCreation userId={userId} messageEndRef={messageEndRef} />
      </div>
      <VideoCallRoom isInCall={isInCall} />
    </div>
  );
};

export default ChatDetail;
