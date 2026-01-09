import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { BookOpen, Sparkles, Share2, Zap } from "lucide-react";

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
          <div className="flex gap-3">
            {isAuthenticated ? (
              <>
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  ダッシュボード
                </Button>
                <Button onClick={() => navigate("/generate")}>
                  物語を生成
                </Button>
              </>
            ) : (
              <Button onClick={handleGetStarted}>
                ログインして始める
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 text-slate-900">
          あなただけの本棚を作ろう
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          AIを使って創作物語を生成し、あなただけの本棚に保存。
          生成された物語は共有URLで他のユーザーと共有することもできます。
        </p>
        <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-6">
          {isAuthenticated ? "ダッシュボードへ" : "ログインして始める"}
        </Button>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
            主な機能
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 border border-slate-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
                <h3 className="font-bold text-lg">AI物語生成</h3>
              </div>
              <p className="text-slate-600">
                プロンプトを入力するだけで、AIが創作的な物語を自動生成します。
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 border border-slate-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h3 className="font-bold text-lg">本棚管理</h3>
              </div>
              <p className="text-slate-600">
                生成した物語を個人の本棚に保存し、いつでも読み返せます。
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 border border-slate-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Share2 className="w-6 h-6 text-blue-600" />
                <h3 className="font-bold text-lg">共有機能</h3>
              </div>
              <p className="text-slate-600">
                共有URLで他のユーザーと物語を共有できます。
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 border border-slate-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
                <h3 className="font-bold text-lg">表紙画像自動生成</h3>
              </div>
              <p className="text-slate-600">
                物語に合わせた表紙画像が自動生成され、本棚がビジュアル的に魅力的になります。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6 text-slate-900">
          今すぐ始めましょう
        </h2>
        <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-6">
          {isAuthenticated ? "ダッシュボードへ" : "ログインして始める"}
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-600">
          <p>&copy; 2026 My Bookshelf. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
