/**
 * アプリケーションのメインコンポーネント。
 * プロバイダー（QueryClientProvider, TooltipProvider）とルーティング（BrowserRouter）のセットアップを担当します。
 */

// 必要なコンポーネントとライブラリをインポートします。
import { Toaster } from "@/components/ui/toaster"; // 標準的なトースト通知
import { Toaster as Sonner } from "@/components/ui/sonner"; // より多機能なトースト通知（Sonnerライブラリ）
import { TooltipProvider } from "@/components/ui/tooltip"; // ツールチップ表示のためのプロバイダー
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // データフェッチングとキャッシュ管理のためのReact Query
import { BrowserRouter, Routes, Route } from "react-router-dom"; // クライアントサイドのルーティング
import Index from "./pages/Index"; // メインページ
import NotFound from "./pages/NotFound"; // 404 Not Found ページ

// React Queryのクライアントインスタンスを作成します。
// これにより、アプリケーション全体でクエリのキャッシュや状態管理が可能になります。
const queryClient = new QueryClient();

/**
 * Appコンポーネント本体。
 * アプリケーション全体のコンテキストプロバイダーとルーティング構造を定義します。
 */
const App = () => (
  // React Query をアプリケーション全体で利用可能にするためのプロバイダー
  <QueryClientProvider client={queryClient}>
    {/* ツールチップ機能を有効にするためのプロバイダー */}
    <TooltipProvider>
      {/* shadcn/ui の Toaster コンポーネントを配置 */}
      <Toaster />
      {/* SonnerライブラリのToasterコンポーネントを配置 */}
      <Sonner />
      {/* HTML5 History API を使用してUIとURLを同期させるルーター */}
      <BrowserRouter>
        {/* ルートの定義を行うコンポーネント */}
        <Routes>
          {/* ルートパス("/")に対応するコンポーネントとしてIndexページを指定 */}
          <Route path="/" element={<Index />} />
          {/* 上記のどのルートにも一致しない場合のキャッチオールルート */}
          {/* NotFoundページを表示 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;