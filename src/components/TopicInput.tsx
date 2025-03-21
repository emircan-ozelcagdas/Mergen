import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TopicInputProps {
  topic: string;
  onTopicChange: (value: string) => void;
}

const TopicInput: React.FC<TopicInputProps> = ({
  topic,
  onTopicChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="topic">Konu</Label>
      <Input
        id="topic"
        type="text"
        placeholder="Öğrenmek istediğiniz konuyu yazınız"
        value={topic}
        onChange={(e) => onTopicChange(e.target.value)}
      />
    </div>
  );
};

export default TopicInput;
