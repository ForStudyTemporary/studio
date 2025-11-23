"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Square, Settings, BellOff } from "lucide-react";
import * as Tone from "tone";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatTime } from "@/lib/utils";
import { playSound, type AlarmSound, alarmSounds } from "@/lib/sounds";
import { SettingsDialog } from "./settings-dialog";
import { cn } from "@/lib/utils";

const DEFAULT_INTERVAL_SECONDS = 3600;

export function Timer() {
  const [isClient, setIsClient] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [alarmSound, setAlarmSound] = useState<AlarmSound>("Synth Beep");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [reminderInterval, setReminderInterval] = useState(DEFAULT_INTERVAL_SECONDS);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const alarmIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastAlarmPointRef = useRef<number>(0);

  useEffect(() => {
    setIsClient(true);

    const savedIsRunning = localStorage.getItem("timerIsRunning") === "true";
    const savedStartTime = parseInt(localStorage.getItem("timerStartTime") || "0", 10);
    const savedAlarmSound = localStorage.getItem("timerAlarmSound") as AlarmSound | null;
    const savedInterval = parseInt(localStorage.getItem("timerInterval") || "0", 10);
    
    if (savedAlarmSound && alarmSounds[savedAlarmSound]) {
        setAlarmSound(savedAlarmSound);
    }
    
    if (savedInterval > 0) {
      setReminderInterval(savedInterval);
    }

    if (savedIsRunning && savedStartTime > 0) {
      const now = Date.now();
      const elapsed = Math.floor((now - savedStartTime) / 1000);
      setElapsedTime(elapsed);
      setIsRunning(true);
      startTimeRef.current = savedStartTime;
      lastAlarmPointRef.current = Math.floor(elapsed / (savedInterval > 0 ? savedInterval : reminderInterval));
    }
  }, [reminderInterval]);

  const stopAlarm = useCallback(() => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    setIsRinging(false);
  }, []);

  const triggerAlarm = useCallback(() => {
    if (isRinging) return;
    setIsRinging(true);
    
    const playAndRepeat = () => {
      playSound(alarmSound);
    }

    playAndRepeat();
    alarmIntervalRef.current = setInterval(playAndRepeat, 2000);
  }, [alarmSound, isRinging]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsedTime(elapsed);
        
        const currentPoint = Math.floor(elapsed / reminderInterval);
        if (reminderInterval > 0 && currentPoint > 0 && currentPoint > lastAlarmPointRef.current) {
          lastAlarmPointRef.current = currentPoint;
          triggerAlarm();
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    if (isClient) {
        localStorage.setItem("timerIsRunning", String(isRunning));
        if (isRunning) {
            localStorage.setItem("timerStartTime", String(startTimeRef.current));
        }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isClient, triggerAlarm, reminderInterval]);

  const handleStartStop = async () => {
    if (Tone.context.state !== 'running') {
        await Tone.start();
    }
      
    if (isRunning) {
      setIsRunning(false);
    } else {
      startTimeRef.current = Date.now() - elapsedTime * 1000;
      setIsRunning(true);
      lastAlarmPointRef.current = Math.floor(elapsedTime / reminderInterval);
    }
  };

  const handleStopAndReset = () => {
      setIsRunning(false);
      setElapsedTime(0);
      lastAlarmPointRef.current = 0;
      localStorage.removeItem("timerIsRunning");
      localStorage.removeItem("timerStartTime");
      stopAlarm();
  }

  const handleAlarmSoundChange = (sound: AlarmSound) => {
    setAlarmSound(sound);
    localStorage.setItem("timerAlarmSound", sound);
    playSound(sound);
  };

  const handleReminderIntervalChange = (interval: number) => {
    if(interval > 0) {
      setReminderInterval(interval);
      localStorage.setItem("timerInterval", String(interval));
    }
  };
  
  if (!isClient) {
    return (
        <Card className="w-full max-w-md mx-auto shadow-2xl animate-pulse">
            <CardHeader className="text-center">
                <div className="h-8 bg-muted-foreground/20 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-muted-foreground/20 rounded w-1/2 mx-auto mt-2"></div>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-8 p-10">
                <div className="h-24 bg-muted-foreground/20 rounded-md w-full"></div>
                <div className="flex gap-4 w-full justify-center">
                    <div className="h-12 w-32 bg-muted-foreground/20 rounded-md"></div>
                    <div className="h-12 w-32 bg-muted-foreground/20 rounded-md"></div>
                    <div className="h-12 w-12 bg-muted-foreground/20 rounded-full"></div>
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <>
      <Card className="w-full max-w-md mx-auto shadow-2xl bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold" style={{ color: 'hsl(var(--accent))' }}>Hourly Reminder</CardTitle>
          <CardDescription>Stay focused, one hour at a time.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-8 p-10">
          <div 
            className={cn(
                "font-mono text-7xl md:text-8xl font-bold tracking-tighter text-foreground transition-transform duration-300 ease-in-out",
                isRinging && "scale-110 animate-pulse"
            )}
          >
            {formatTime(elapsedTime)}
          </div>
          <div className="flex items-center gap-4">
            {isRinging ? (
              <Button onClick={stopAlarm} size="lg" className="w-48 text-lg font-semibold" variant="destructive">
                <BellOff className="mr-2" />
                Stop Alarm
              </Button>
            ) : (
              <>
                <Button onClick={handleStartStop} size="lg" className="w-32 text-lg font-semibold">
                  {isRunning ? <Square className="mr-2" /> : <Play className="mr-2" />}
                  {isRunning ? "Stop" : "Start"}
                </Button>
                 {(!isRunning && elapsedTime > 0) && <Button onClick={handleStopAndReset} size="lg" variant="secondary" className="w-32 text-lg font-semibold" disabled={!isRunning && elapsedTime === 0}>
                    <Square className="mr-2" />
                    Reset
                </Button>}
              </>
            )}

            <Button onClick={() => setIsSettingsOpen(true)} variant="ghost" size="icon" aria-label="Open settings" disabled={isRinging}>
              <Settings />
            </Button>
          </div>
        </CardContent>
      </Card>
      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        alarmSound={alarmSound}
        onAlarmSoundChange={handleAlarmSoundChange}
        reminderInterval={reminderInterval}
        onReminderIntervalChange={handleReminderIntervalChange}
      />
    </>
  );
}
