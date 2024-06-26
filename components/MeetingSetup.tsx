"use client";

import {
  DeviceSettings,
  OwnCapability,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isMicCamToggled, setIsMicCamToggled] = useState(true);
  const call = useCall();
  const { useCallThumbnail, useCallSession,useHasPermissions  } = useCallStateHooks();
  const thumbnail = useCallThumbnail();
  const canSendAudio = useHasPermissions(OwnCapability.SEND_AUDIO);
  
  if (!call) {
    throw new Error(
      "useStreamCall must be used within a StreamCall component."
    );
  }

  useEffect(() => {
    if (isMicCamToggled) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [isMicCamToggled, call.camera, call.microphone]);

  const session = useCallSession();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-center text-2xl font-bold">Setup</h1>
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isMicCamToggled}
            onChange={(e) => setIsMicCamToggled(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <div className="flex flex-col gap-5 w-[500px] items-start">
        <h2>Participants</h2>
        <ul className="flex flex-wrap items-center gap-5 max-w-full">
          {session?.participants.map((participant) => (
            <li
              className="flex items-center gap-3"
              key={participant.user_session_id}
            >
              <Avatar>
                <AvatarImage src={participant?.user?.image} />
                <AvatarFallback> {participant?.user?.name}</AvatarFallback>
              </Avatar>
              <span className="block">{participant?.user?.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <Button
        className="rounded-md bg-green-500 mt-4 px-4 py-2.5"
        onClick={() => {
          call.join();
          setIsSetupComplete(true);
        }}
      >
        Join meeting
      </Button>
    </div>
  );
};

export default MeetingSetup;
