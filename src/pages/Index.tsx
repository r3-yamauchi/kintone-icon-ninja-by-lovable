/**
 * アプリケーションのメインページ（インデックスページ）コンポーネント。
 * ページのレイアウト、ヘッダー、メインコンテンツ（IconGenerator）、フッターを定義します。
 */

import { IconGenerator } from "@/components/IconGenerator"; // アイコン生成機能のメインコンポーネント
import { Palette } from "lucide-react"; // lucide-reactからパレットアイコンをインポート

/**
 * Indexページコンポーネント。
 * ユーザーが最初に目にする画面を構築します。
 */
const Index = () => {
  return (
    // 画面全体のコンテナ。背景にグラデーションを設定。
    <div className="min-h-screen bg-gradient-to-br from-background via-accent to-background">
      {/* コンテンツの中央寄せと余白を設定するコンテナ */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* ページのヘッダー部分 */}
        <header className="text-center mb-8 sm:mb-12 space-y-4">
          {/* アイコンの表示部分 */}
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* アイコンを囲む要素。グラデーション背景、影、浮遊アニメーションを適用 */}
            <div className="p-3 rounded-2xl gradient-primary shadow-large animate-float">
              {/* パレットアイコン */}
              <Palette className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          {/* メインタイトル */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary">
            kintone アイコンジェネレーター
          </h1>
          {/* サブタイトル・説明文 */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            AIを使って、あなたのkintoneアプリにぴったりのアイコンを簡単に生成できます
          </p>
        </header>

        {/* メインコンテンツエリア */}
        <main>
          {/* アイコンジェネレーターコンポーネントを配置 */}
          <IconGenerator />
        </main>

        {/* フッター部分 */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Powered by Lovable AI (Nano Banana)</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;