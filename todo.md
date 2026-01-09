# My Bookshelf - Project TODO

## Database & Backend Setup
- [x] ユーザーテーブル拡張（プロフィール情報）
- [x] 物語テーブル作成（title, content, coverImage, isPublic, shareToken等）
- [x] 物語の共有テーブル作成
- [x] データベーススキーマ確定とマイグレーション実行

## Backend API Implementation
- [x] 物語生成API（LLM統合）
- [x] 物語保存API
- [x] 物語一覧取得API
- [x] 物語詳細取得API
- [x] 物語削除API
- [x] 物語編集API
- [x] 物語共有URL生成API
- [x] 共有物語閲覧API（認証なし）
- [x] 表紙画像生成API

## Frontend Pages & Components
- [x] ホームページ（ランディング）
- [x] ログイン後のダッシュボード
- [x] 物語生成ページ（プロンプト入力）
- [ ] 物語ストリーミング表示コンポーネント
- [x] 本棚ページ（物語一覧）
- [x] 物語詳細ページ
- [ ] 物語編集ページ
- [x] 共有物語閲覧ページ
- [ ] ユーザープロフィールページ
- [x] ナビゲーションバー（ログアウト機能含む）

## LLM & Streaming Integration
- [x] LLM呼び出し実装（創作的な物語生成プロンプト）
- [ ] ストリーミングレスポンス処理
- [ ] フロントエンドでのストリーミング表示

## Image Generation
- [x] 物語に基づいた表紙画像生成
- [x] 画像キャッシング・管理
- [x] S3への画像アップロード

## Testing & Optimization
- [x] ユーザー認証フロー確認
- [ ] 物語生成・保存フロー確認
- [x] 共有機能確認
- [ ] ストリーミング表示確認
- [ ] 画像生成確認
- [ ] パフォーマンス最適化
- [x] エラーハンドリング確認

## Deployment
- [ ] 最終動作確認
- [ ] チェックポイント作成
- [ ] デプロイ準備完了
