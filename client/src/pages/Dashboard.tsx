import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { BookOpen, LogOut, Plus, Trash2, Share2, Eye } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const { data: stories, isLoading, refetch } = trpc.stories.list.useQuery();
  const deleteStoryMutation = trpc.stories.delete.useMutation();
  const togglePublicMutation = trpc.stories.togglePublic.useMutation();
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast.success("ログアウトしました");
    } catch (error) {
      toast.error("ログアウトに失敗しました");
    }
  };

  const handleDeleteStory = async (storyId: number) => {
    if (!confirm("この物語を削除してもよろしいですか？")) return;

    try {
      await deleteStoryMutation.mutateAsync({ id: storyId });
      refetch();
      toast.success("物語を削除しました");
    } catch (error) {
      toast.error("物語の削除に失敗しました");
    }
  };

  const handleTogglePublic = async (storyId: number) => {
    try {
      await togglePublicMutation.mutateAsync({ id: storyId });
      refetch();
      toast.success("公開設定を変更しました");
    } catch (error) {
      toast.error("公開設定の変更に失敗しました");
    }
  };

  const handleCopyShareLink = (shareToken: string) => {
    const url = `${window.location.origin}/shared/${shareToken}`;
    navigator.clipboard.writeText(url);
    toast.success("共有リンクをコピーしました");
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
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">あなたの本棚</h1>
            <p className="text-slate-600 mt-2">
              {stories?.length || 0}冊の物語が保存されています
            </p>
          </div>
          <Button onClick={() => navigate("/generate")} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            新しい物語を生成
          </Button>
        </div>

        {/* Stories Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">読み込み中...</p>
          </div>
        ) : stories && stories.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Cover Image */}
                {story.coverImage ? (
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-blue-300" />
                  </div>
                )}

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    {story.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {story.content}
                  </p>

                  {/* Meta Info */}
                  <div className="text-xs text-slate-500 mb-4">
                    <p>
                      作成日:{" "}
                      {new Date(story.createdAt).toLocaleDateString("ja-JP")}
                    </p>
                    <p>閲覧数: {story.viewCount}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/story/${story.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyShareLink(story.shareToken || "")}
                      disabled={!story.shareToken}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteStory(story.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">
              まだ物語が保存されていません
            </p>
            <Button onClick={() => navigate("/generate")}>
              最初の物語を生成する
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
