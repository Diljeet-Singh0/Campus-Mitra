import React from 'react';
import type { CheckinData } from '../../types';
import { MoodCheckinStepper } from '../../components/student/MoodCheckinStepper';

interface StudentCheckinPageProps {
  onSubmitCheckin: (checkin: Omit<CheckinData, 'id' | 'timestamp'>) => void;
}

export const StudentCheckinPage: React.FC<StudentCheckinPageProps> = ({ onSubmitCheckin }) => {
  return (
    <div className="py-6 space-y-6 animate-fade-in">
      <MoodCheckinStepper onSubmit={onSubmitCheckin} />
    </div>
  );
};
