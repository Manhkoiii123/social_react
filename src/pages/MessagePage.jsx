import { Outlet } from "react-router-dom";
import ConversationList from "../components/Messages/ConversationList";

const MessagePage = () => {
  return (
    <div className="container gap-0">
      <div className="sm:flex-1">
        <ConversationList />
      </div>
      <div className="sm:flex-[2]">
        <Outlet />
      </div>
    </div>
  );
};
export default MessagePage;
