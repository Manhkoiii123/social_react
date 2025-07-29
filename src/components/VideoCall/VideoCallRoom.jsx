import CallControls from "./CallControls";

const VideoCallRoom = ({ isInCall }) => {
  if (!isInCall) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="relative flex-1">
        <div className="absolute inset-0">
          <video autoPlay playsInline className="h-full w-full" />
        </div>
        <div className="absolute bottom-4 right-4 h-40 w-72 overflow-hidden rounded-lg bg-gray-900">
          <video autoPlay playsInline className="h-full w-full" />
        </div>
      </div>
      <CallControls />
    </div>
  );
};
export default VideoCallRoom;
