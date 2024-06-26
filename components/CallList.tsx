"use client";

import { useGetCalls } from "@/hooks/useGetCalls";
import {
  Call,
  CallRecording,
  QueryCallMembersResponse,
  useCallStateHooks,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import { Loader } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { useUser } from "@clerk/nextjs";

const CallList = ({ type }: { type: "ended" | "upcomming" | "recordings" }) => {
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  const router = useRouter();

  const [recordings, setRecording] = useState<CallRecording[]>([]);

  const { toast } = useToast();
  const [members, setMembers] = useState<QueryCallMembersResponse[]>([]);

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "upcomming":
        return upcomingCalls;
      case "recordings":
        return recordings;
      default:
        return [];
    }
  };
  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No Previous Calls";
      case "recordings":
        return "No Recordings";
      case "upcomming":
        return "No Upcomming";
      default:
        return "";
    }
  };

  useEffect(() => {
    try {
      const fetchRecordings = async () => {
        const callData = await Promise.all(
          callRecordings?.map((meeting) => meeting.queryRecordings()) ?? []
        );

        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);
        setRecording(recordings);
      };
      if (type === "recordings") fetchRecordings();
      if (type === "ended") {
        const fetchMembers = async () => {
          try {
            const membersData = await Promise.all(
              endedCalls?.map((call) => call.queryMembers()) ?? []
            );

          } catch (error) {
            toast({ title: "Try again later" });
          }
        };
        fetchMembers();
      }
    } catch (error) {
      toast({ title: "Try again later" });
    }
  }, [type, callRecordings, toast]);

  if (isLoading) return <Loader />;

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={(meeting as Call).id}
            icon={
              type === "ended"
                ? "/icons/previous.svg"
                : type === "upcomming"
                ? "/icons/upcoming.svg"
                : "/icons/recordings.svg"
            }
            bgColor={
              type == "ended"
                ? "bg-[#38bdf8]"
                : type == "recordings"
                ? "bg-[#4f46e5]"
                : "bg-[#fecdd3"
            }
            title={
              (meeting as Call).state?.custom?.description ||
              (meeting as CallRecording).filename?.substring(0, 20) ||
              "No Description"
            }
            date={
              (meeting as Call).state?.startsAt?.toLocaleString() ||
              (meeting as CallRecording).start_time?.toLocaleString()
            }
            isPreviousMeeting={type === "ended"}
            link={
              type === "recordings"
                ? (meeting as CallRecording).url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${
                    (meeting as Call).id
                  }`
            }
            buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
            buttonText={type === "recordings" ? "Play" : "Start"}
            handleClick={
              type === "recordings"
                ? () => router.push(`${(meeting as CallRecording).url}`)
                : () => router.push(`/meeting/${(meeting as Call).id}`)
            }
          />
        ))
      ) : (
        <h1 className="text-2xl font-bold text-white">{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
