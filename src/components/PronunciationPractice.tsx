import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mic, Square, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const PronunciationPractice = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        await analyzePronunciation(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Microphone access denied",
        description: "Please allow microphone access to use this feature",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      setIsAnalyzing(true);
    }
  };

  const analyzePronunciation = async (audioBlob: Blob) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(",")[1];

        const { data, error } = await supabase.functions.invoke("analyze-pronunciation", {
          body: { audio: base64Audio },
        });

        if (error) throw error;

        setFeedback(data);
        toast({
          title: "Analysis complete!",
          description: "Check your pronunciation feedback below",
        });
      };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: "Please try again",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pronunciation Practice</CardTitle>
        <CardDescription>
          Record yourself speaking and get instant AI feedback
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                size="lg"
                disabled={isAnalyzing}
                className="gap-2"
              >
                <Mic className="h-5 w-5" />
                Start Recording
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                size="lg"
                variant="destructive"
                className="gap-2"
              >
                <Square className="h-5 w-5" />
                Stop Recording
              </Button>
            )}
          </div>

          {isRecording && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
              <div className="h-3 w-3 rounded-full bg-destructive" />
              Recording in progress...
            </div>
          )}

          {isAnalyzing && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing your pronunciation...
            </div>
          )}
        </div>

        {feedback && (
          <div className="space-y-4 animate-fade-in">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Accuracy Score</span>
                    <span className="text-2xl font-bold text-primary">
                      {feedback.score || 85}%
                    </span>
                  </div>
                  <Progress value={feedback.score || 85} className="h-2" />
                </div>

                <div>
                  <h4 className="mb-2 font-medium">Transcription</h4>
                  <p className="text-muted-foreground">{feedback.transcription}</p>
                </div>

                {feedback.suggestions && (
                  <div>
                    <h4 className="mb-2 font-medium">Improvement Tips</h4>
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      {feedback.suggestions.map((tip: string, index: number) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PronunciationPractice;
