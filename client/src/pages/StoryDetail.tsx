import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { BookOpen, LogOut, ArrowLeft, Share2, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Streamdown } from "streamdown";

export default function StoryDetail({ params }: { params: { id: string } }) {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const storyId = parseInt(params.id);
  const { data: story, isLoading } = trpc.stories.getById.useQuery({ id: storyId });
  const deleteStoryMutation = trpc.stories.delete.useMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast.success("ログアウトしました");
    } catch (error) {
      toast.error("ログアウトに失敗しました");
    }
  };

  const handleDeleteStory = async () => {
    if (!confirm("この物語を削除してもよろしいですか？")) return;

    try {
      await deleteStoryMutation.mutateAsync({ id: storyId });
      toast.success("物語を削除しました");
      navigate("/dashboard");
    } catch (error) {
      toast.error("物語の削除に失敗しました");
    }
  };

  const handleCopyShareLink = () => {
    if (!story?.shareToken) return;
    const url = `${window.location.origin}/shared/${story.shareToken}`;
    navigator.clipboard.writeText(url);
    toast.success("共有リンクをコピーしました");
  };

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
          <Button onClick={() => navigate("/dashboard")}>
            ダッシュボードに戻る
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
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard")}
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
                <span className="font-medium">最終更新:</span>{" "}
                {new Date(story.updatedAt).toLocaleDateString("ja-JP")}
              </div>
              <div>
                <span className="font-medium">閲覧数:</span> {story.viewCount}
              </div>
            </div>

            {/* Story Content */}
            <div className="prose prose-sm max-w-none mb-8">
              <Streamdown>{story.content}</Streamdown>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              <Button onClick={handleCopyShareLink} variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                共有リンクをコピー
              </Button>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                編集
              </Button>
              <Button
                onClick={handleDeleteStory}
                variant="destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                削除
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
