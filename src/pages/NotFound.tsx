/**
 * 404 Not Found ページコンポーネント。
 * 存在しないURLにアクセスした際に表示されます。
 */

import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  // 現在のURL情報を取得するためのフック
  const location = useLocation();

  // location.pathnameが変更されるたびに実行される副作用
  useEffect(() => {
    // 開発者コンソールに404エラーの情報を出力
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]); // 依存配列にpathnameを指定し、パスが変わった時のみ実行

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-gray-600">Oops! Page not found</p>
        <a href="/" className="text-blue-500 underline hover:text-blue-700">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;