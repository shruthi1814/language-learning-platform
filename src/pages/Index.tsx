import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Mic, BookOpen, Brain, Globe } from "lucide-react";

const Index = () => {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-glow to-purple-600 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="animate-fade-in text-center text-white">
            <h1 className="mb-6 text-5xl font-bold md:text-6xl lg:text-7xl">
              Master Any Language
              <span className="block text-primary-glow">With AI-Powered Learning</span>
            </h1>
            <p className="mb-8 text-lg text-white/90 md:text-xl">
              Perfect your pronunciation, master grammar, and learn at your own pace
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
                asChild
              >
                <Link to="/auth">Get Started Free</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white bg-white/10 text-white hover:bg-white/20 sm:w-auto"
                asChild
              >
                <Link to="/dashboard">View Demo</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            Everything You Need to Excel
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="group p-6 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <Mic className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Pronunciation Feedback</h3>
              <p className="text-muted-foreground">
                Get instant AI analysis of your pronunciation with detailed accuracy scores
              </p>
            </Card>

            <Card className="group p-6 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="mb-4 inline-flex rounded-lg bg-secondary/10 p-3">
                <BookOpen className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Grammar Analysis</h3>
              <p className="text-muted-foreground">
                Detect mistakes instantly and get helpful corrections with explanations
              </p>
            </Card>

            <Card className="group p-6 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-3">
                <Brain className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Personalized Lessons</h3>
              <p className="text-muted-foreground">
                Adaptive lessons that grow with you based on your progress and goals
              </p>
            </Card>

            <Card className="group p-6 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Word Lookup</h3>
              <p className="text-muted-foreground">
                Instant translations, meanings, and example sentences for any word
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Start Your Language Journey?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of learners improving their language skills every day
          </p>
          <Button size="lg" asChild>
            <Link to="/auth">Sign Up Now</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Index;
