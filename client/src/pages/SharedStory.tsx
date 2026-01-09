import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Streamdown } from "streamdown";

export default function SharedStory({ params }: { params: { shareToken: string } }) {
  const [, navigate] = useLocation();
  const { data: story, isLoading } = trpc.stories.getByShareToken.useQuery({
    shareToken: params.shareToken,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">読み込み中...</p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">物語が見つかりません</p>
          <Button onClick={() => navigate("/")}>
            ホームに戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-lg">My Bookshelf</span>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            ホーム
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          戻る
        </Button>

        {/* Story Container */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          {/* Cover Image */}
          {story.coverImage ? (
            <img
              src={story.coverImage}
              alt={story.title}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-blue-300" />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Title */}
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              {story.title}
            </h1>

            {/* Meta Information */}
            <div className="flex gap-6 mb-6 text-sm text-slate-600 pb-6 border-b border-slate-200">
              <div>
                <span className="font-medium">作成日:</span>{" "}
                {new Date(story.createdAt).toLocaleDateString("ja-JP")}
              </div>
              <div>
                <span className="font-medium">閲覧数:</span> {story.viewCount}
              </div>
            </div>

            {/* Story Content */}
            <div className="prose prose-sm max-w-none mb-8">
              <Streamdown>{story.content}</Streamdown>
            </div>

            {/* Footer */}
            <div className="text-center pt-6 border-t border-slate-200">
              <p className="text-slate-600 mb-4">
                この物語は My Bookshelf で共有されています
              </p>
              <Button onClick={() => navigate("/")}>
                My Bookshelf を使ってみる
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
