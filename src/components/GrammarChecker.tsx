import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const GrammarChecker = () => {
  const [text, setText] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const checkGrammar = async () => {
    if (!text.trim()) {
      toast({
        variant: "destructive",
        title: "No text provided",
        description: "Please enter some text to check",
      });
      return;
    }

    setIsChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-grammar", {
        body: { text },
      });

      if (error) throw error;

      setResults(data);
      toast({
        title: "Grammar check complete!",
        description: `Found ${data.errors?.length || 0} issues`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Check failed",
        description: "Please try again",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grammar Analysis</CardTitle>
        <CardDescription>
          Enter text or paste content to check for grammar mistakes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Type or paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px]"
          />
        </div>

        <Button
          onClick={checkGrammar}
          disabled={isChecking || !text.trim()}
          className="w-full"
        >
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Check Grammar"
          )}
        </Button>

        {results && (
          <div className="space-y-4 animate-fade-in">
            {results.errors && results.errors.length > 0 ? (
              <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    Issues Found ({results.errors.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {results.errors.map((error: any, index: number) => (
                    <div key={index} className="space-y-2 border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <p className="font-medium text-destructive">{error.message}</p>
                          {error.context && (
                            <p className="text-sm text-muted-foreground">
                              Context: "{error.context}"
                            </p>
                          )}
                        </div>
                      </div>
                      {error.suggestions && error.suggestions.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Suggestions:</p>
                          <div className="flex flex-wrap gap-2">
                            {error.suggestions.map((suggestion: string, i: number) => (
                              <span
                                key={i}
                                className="rounded-full bg-secondary/20 px-3 py-1 text-sm text-secondary-foreground"
                              >
                                {suggestion}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {error.explanation && (
                        <p className="text-sm text-muted-foreground">{error.explanation}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-secondary/20 bg-secondary/5">
                <CardContent className="flex items-center gap-2 pt-6">
                  <CheckCircle2 className="h-5 w-5 text-secondary" />
                  <p className="font-medium">No grammar issues found!</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GrammarChecker;
