"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  StreamVideoClient,
  StreamVideo,
  Logger,
  LogLevel,
  logToConsole,
} from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import * as Sentry from '@sentry/nextjs';

import { tokenProvider } from "@/actions/stream.action";
import Loader from "@/components/Loader";

const logLevelMapping = new Map<LogLevel, Sentry.SeverityLevel>();
logLevelMapping.set('debug', 'debug');
logLevelMapping.set('info', 'info');
logLevelMapping.set('warn', 'warning');
logLevelMapping.set('error', 'error');

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

export const customSentryLogger: Logger = (
  logLevel: LogLevel,
  message: string,
  ...args: unknown[]
) => {
  if (logLevel === 'warn' || logLevel === 'error') {
    Sentry.captureEvent({
      level: logLevelMapping.get(logLevel),
    });
  }

  // Call the SDK's default log method
  logToConsole(logLevel, message, { data: 'some data' });
};
const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;
    if (!API_KEY) throw new Error("Stream API key is missing");

    const client = new StreamVideoClient({
      apiKey: API_KEY,
      user: {
        id: user?.id,
        name: user?.username || user?.id,
        image: user?.imageUrl,
      },
      tokenProvider: tokenProvider,
      options: {
        logLevel: "info",
        logger: customSentryLogger,
      },
    });

    setVideoClient(client);
  }, [user, isLoaded]);

  if (!videoClient) return <Loader />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
