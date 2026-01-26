import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { BookOpen } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      window.location.href = getLoginUrl();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-lg">My Bookshelf</span>
          </div>
        </div>
      </nav>

      {/* Simple Hero Section */}
      <section className="max-w-4xl mx-auto px-4 py-32 text-center">
        <h1 className="text-5xl font-bold mb-6 text-slate-900">
          あなただけの本棚を作ろう
        </h1>
        <p className="text-xl text-slate-600 mb-12">
          AIで物語を生成し、本棚に保存できます。
        </p>
        <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-6">
          ログインして始める
        </Button>
      </section>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full border-t border-slate-200 bg-white/80 backdrop-blur-sm py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-600">
          <p>&copy; 2026 My Bookshelf. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
