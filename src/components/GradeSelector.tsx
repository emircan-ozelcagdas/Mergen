import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GradeSelectorProps {
  selectedGrade: string;
  onGradeChange: (value: string) => void;
}

const grades = [
  { value: '9', label: '9. Sınıf' },
  { value: '10', label: '10. Sınıf' },
];

const GradeSelector: React.FC<GradeSelectorProps> = ({
  selectedGrade,
  onGradeChange,
}) => {
  return (
    <div className="relative">
      <label htmlFor="grade-selector" className="block text-sm font-medium text-gray-700 mb-1">
        Sınıf
      </label>
      <div className="relative">
        <select
          id="grade-selector"
          value={selectedGrade}
          onChange={(e) => onGradeChange(e.target.value)}
          className="selector w-full pr-8"
        >
          <option value="" disabled>Sınıf Seçiniz</option>
          {grades.map((grade) => (
            <option key={grade.value} value={grade.value}>
              {grade.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default GradeSelector;
