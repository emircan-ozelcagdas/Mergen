
import React from 'react';

export interface SubjectSelectorProps {
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
}

const subjects = [
  { id: "literature", name: "Edebiyat" },
  { id: "mathematics", name: "Matematik" }
];

const SubjectSelector: React.FC<SubjectSelectorProps> = ({ selectedSubject, onSubjectChange }) => {
  return (
    <div className="relative">
      <label htmlFor="subject-selector" className="block text-sm font-medium text-gray-700 mb-1">
        Ders
      </label>
      <div className="relative">
        <select
          id="subject-selector"
          value={selectedSubject}
          onChange={(e) => onSubjectChange(e.target.value)}
          className="selector w-full pr-8"
        >
          <option value="" disabled>Ders Seçiniz</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
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

export default SubjectSelector;
