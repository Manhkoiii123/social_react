import {
  Mic,
  MicOff,
  PhoneDisabled,
  Videocam,
  VideocamOff,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";

const CallControls = () => {
  return (
    <div className="flex justify-center gap-3 bg-gray-900 p-4">
      <IconButton>
        {/* {isAudioMuted ? (
          <MicOff className="text-dark-400" />
        ) : ( */}
        <Mic className="text-dark-400" />
        {/* )} */}
      </IconButton>
      <IconButton>
        <PhoneDisabled className="text-red-500" />
      </IconButton>
      <IconButton>
        {/* {isVideoMuted ? (
          <VideocamOff className="text-dark-400" />
        ) : ( */}
        <Videocam className="text-dark-400" />
        {/* )} */}
      </IconButton>
    </div>
  );
};
export default CallControls;
