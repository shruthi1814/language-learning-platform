import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2, BookOpen } from "lucide-react";

const WordLookup = () => {
  const [word, setWord] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [definition, setDefinition] = useState<any>(null);
  const { toast } = useToast();

  const lookupWord = async () => {
    if (!word.trim()) {
      toast({
        variant: "destructive",
        title: "No word entered",
        description: "Please enter a word to look up",
      });
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke("lookup-word", {
        body: { word: word.trim() },
      });

      if (error) throw error;

      setDefinition(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lookup failed",
        description: "Could not find the word. Please try another one.",
      });
      setDefinition(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupWord();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Word Lookup</CardTitle>
        <CardDescription>
          Search for word meanings, translations, and examples
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Enter a word..."
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isSearching}>
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search
              </>
            )}
          </Button>
        </form>

        {definition && (
          <div className="space-y-4 animate-fade-in">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {definition.word}
                </CardTitle>
                {definition.phonetic && (
                  <CardDescription className="text-base">
                    {definition.phonetic}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {definition.meanings?.map((meaning: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <p className="font-semibold text-primary">
                      {meaning.partOfSpeech}
                    </p>
                    <ol className="ml-4 list-decimal space-y-2">
                      {meaning.definitions?.slice(0, 3).map((def: any, i: number) => (
                        <li key={i} className="text-sm">
                          <p className="font-medium">{def.definition}</p>
                          {def.example && (
                            <p className="mt-1 italic text-muted-foreground">
                              Example: "{def.example}"
                            </p>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}

                {definition.synonyms && definition.synonyms.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-semibold">Synonyms:</p>
                    <div className="flex flex-wrap gap-2">
                      {definition.synonyms.slice(0, 5).map((syn: string, i: number) => (
                        <span
                          key={i}
                          className="rounded-full bg-secondary/20 px-3 py-1 text-sm"
                        >
                          {syn}
                        </span>
                      ))}
                    </div>
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

export default WordLookup;
