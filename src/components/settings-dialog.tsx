"use client";

import type { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { alarmSounds, type AlarmSound } from "@/lib/sounds";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alarmSound: AlarmSound;
  onAlarmSoundChange: (sound: AlarmSound) => void;
  reminderInterval: number;
  onReminderIntervalChange: (interval: number) => void;
}

export const SettingsDialog: FC<SettingsDialogProps> = ({
  open,
  onOpenChange,
  alarmSound,
  onAlarmSoundChange,
  reminderInterval,
  onReminderIntervalChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your hourly reminder settings.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reminder-interval" className="text-right">
              Interval (min)
            </Label>
            <Input
              id="reminder-interval"
              type="number"
              value={reminderInterval / 60}
              onChange={(e) => onReminderIntervalChange(parseInt(e.target.value, 10) * 60)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="alarm-sound" className="text-right">
              Alarm Sound
            </Label>
            <Select
              value={alarmSound}
              onValueChange={(value) => onAlarmSoundChange(value as AlarmSound)}
            >
              <SelectTrigger id="alarm-sound" className="col-span-3">
                <SelectValue placeholder="Select a sound" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(alarmSounds).map((sound) => (
                  <SelectItem key={sound} value={sound}>
                    {sound}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
