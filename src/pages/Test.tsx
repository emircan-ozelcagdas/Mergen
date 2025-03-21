import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { generateTest, type Question } from '@/lib/gemini-api';
import { toast } from 'sonner';

const Test = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const generateQuestions = async () => {
      try {
        const state = location.state as { grade: string; subject: string; topic: string };
        if (!state) {
          toast.error('Test parametreleri bulunamadı');
          navigate('/chat');
          return;
        }

        const response = await generateTest(state);
        if (!response.success || !response.data) {
          throw new Error(response.error?.message || 'Test oluşturulamadı');
        }

        setQuestions(response.data.questions);
        setAnswers(new Array(response.data.questions.length).fill(-1));
      } catch (error) {
        console.error('Sorular yüklenirken hata oluştu:', error);
        toast.error('Sorular yüklenirken bir hata oluştu');
        navigate('/chat');
      } finally {
        setIsLoading(false);
      }
    };

    generateQuestions();
  }, [location.state, navigate]);

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionId - 1] = answerIndex;
      return newAnswers;
    });
  };

  const calculateScore = () => {
    return answers.filter((answer, index) => answer === questions[index].correctAnswer).length;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Konu Testi</h1>
        <Button variant="outline" onClick={() => navigate('/chat')}>
          Chat'e Dön
        </Button>
      </div>

      {!showResults ? (
        <div className="space-y-8">
          {questions.map((question, index) => (
            <Card key={question.id} className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {index + 1}. {question.question}
              </h3>
              <RadioGroup
                value={answers[question.id - 1].toString()}
                onValueChange={(value) => handleAnswerSelect(question.id, parseInt(value))}
              >
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={optionIndex.toString()}
                      id={`question-${question.id}-option-${optionIndex}`}
                    />
                    <Label htmlFor={`question-${question.id}-option-${optionIndex}`}>
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </Card>
          ))}
          <div className="flex justify-end">
            <Button onClick={() => setShowResults(true)}>
              Testi Bitir
            </Button>
          </div>
        </div>
      ) : (
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Test Sonucu</h2>
          <p className="text-xl mb-6">
            Toplam {questions.length} sorudan {calculateScore()} doğru cevap verdiniz.
          </p>
          <div className="space-x-4">
            <Button onClick={() => setShowResults(false)}>
              Testi Tekrarla
            </Button>
            <Button variant="outline" onClick={() => navigate('/chat')}>
              Chat'e Dön
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Test; 