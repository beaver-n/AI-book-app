import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { BookOpen, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function GenerateStory() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const generateMutation = trpc.stories.generate.useMutation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast.success("ログアウトしました");
    } catch (error) {
      toast.error("ログアウトに失敗しました");
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("プロンプトを入力してください");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateMutation.mutateAsync({ prompt });
      setGeneratedContent(result.content);
      toast.success("物語を生成しました！");
      
      // Navigate to the new story after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      toast.error("物語の生成に失敗しました");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-lg">My Bookshelf</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.name}</span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              ログアウト
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            新しい物語を生成
          </h1>
          <p className="text-slate-600 mb-8">
            プロンプトを入力して、AIが創作的な物語を生成します。
          </p>

          {/* Prompt Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              物語のプロンプト
            </label>
            <Textarea
              placeholder="例: 未来の宇宙ステーションで起こる冒険の物語を書いてください。主人公は若い宇宙飛行士で、謎の信号を受け取ります..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              className="min-h-32"
            />
            <p className="text-xs text-slate-500 mt-2">
              詳しく、具体的なプロンプトを入力するほど、より良い物語が生成されます。
            </p>
          </div>

          {/* Generated Content Preview */}
          {generatedContent && (
            <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">生成された物語:</h3>
              <p className="text-slate-700 text-sm line-clamp-6">
                {generatedContent}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              size="lg"
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                "物語を生成"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              disabled={isGenerating}
              size="lg"
            >
              キャンセル
            </Button>
          </div>

          {/* Tips */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-2">💡 ヒント:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 具体的なシーン、キャラクター、感情を描写してください</li>
              <li>• ジャンル（ファンタジー、SF、ミステリーなど）を指定すると効果的です</li>
              <li>• 物語の長さや雰囲気も指定できます</li>
              <li>• 複数回試して、最高の結果を得ることができます</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
