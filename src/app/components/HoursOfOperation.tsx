import React, { useState, useEffect } from 'react';

interface HoursOfOperationProps {
  onHoursChange: (hours: string) => void;
  existingHours?: string;
}

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']; // Example days of the week

const HoursOfOperation: React.FC<HoursOfOperationProps> = ({ onHoursChange }) => {

  useEffect(() => {
    onHoursChange(constructHoursString(startTimes, endTimes));
  }, []);
  
  const [startTimes, setStartTimes] = useState<string[]>(new Array(days.length).fill('09:00'));
  const [endTimes, setEndTimes] = useState<string[]>(new Array(days.length).fill('17:00'));

  const handleStartTimeChange = (index: number, value: string): void => {
    const updatedTimes = [...startTimes];
    updatedTimes[index] = value;
    setStartTimes(updatedTimes);
    notifyHoursChange(updatedTimes, endTimes);
  };

  const handleEndTimeChange = (index: number, value: string): void => {
    const updatedTimes = [...endTimes];
    updatedTimes[index] = value;
    setEndTimes(updatedTimes);
    notifyHoursChange(startTimes, updatedTimes);
  };

  const notifyHoursChange = (startTimes: string[], endTimes: string[]): void => {
    onHoursChange(constructHoursString(startTimes, endTimes));
  };

  const isAnyTimeEmpty = (): boolean => {
    return startTimes.some((time) => !time) || endTimes.some((time) => !time);
  };

  const constructHoursString = (startTimes: string[], endTimes: string[]): string => {
    return days
      .map((day, index) => {
        const startTime = convertTo12HourFormat(startTimes[index]);
        const endTime = convertTo12HourFormat(endTimes[index]);
        return `${day}: ${startTime} to ${endTime}`;
      })
      .join(', ');
  };

  const convertTo12HourFormat = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const period = parseInt(hours, 10) >= 12 ? 'PM' : 'AM';
    const adjustedHours = (parseInt(hours, 10) % 12) || 12;
    return `${adjustedHours}:${minutes} ${period}`;
  };

  return (
    <div>
      <label className="text-black block mb-2">Hours of Operation</label>
      <div className="mb-4">
        <label className="text-black block mb-2">Select Days and Hours</label>
        <div className="flex flex-col">
          {days.map((day, index) => (
            <div key={index} className="flex justify-between mb-2">
              <span className="text-black">{day}</span>
              <div className="flex">
                <input
                  type="time"
                  value={startTimes[index]}
                  onChange={(e) => handleStartTimeChange(index, e.target.value)}
                  className="border p-2 w-24 text-black"
                />
                <span className="mx-2 text-black">to</span>
                <input
                  type="time"
                  value={endTimes[index]}
                  onChange={(e) => handleEndTimeChange(index, e.target.value)}
                  className="border p-2 w-24 text-black"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HoursOfOperation;
