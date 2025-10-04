import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import PronunciationPractice from "@/components/PronunciationPractice";
import GrammarChecker from "@/components/GrammarChecker";
import WordLookup from "@/components/WordLookup";
import { LogOut, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold">Language Learning</h1>
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-6">
        <Card className="border-none shadow-lg bg-gradient-to-br from-primary/10 to-secondary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Welcome Back!
            </CardTitle>
            <CardDescription>
              Continue your language learning journey with AI-powered tools
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="pronunciation" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pronunciation">Pronunciation</TabsTrigger>
            <TabsTrigger value="grammar">Grammar</TabsTrigger>
            <TabsTrigger value="lookup">Word Lookup</TabsTrigger>
          </TabsList>

          <TabsContent value="pronunciation" className="space-y-4">
            <PronunciationPractice />
          </TabsContent>

          <TabsContent value="grammar" className="space-y-4">
            <GrammarChecker />
          </TabsContent>

          <TabsContent value="lookup" className="space-y-4">
            <WordLookup />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
