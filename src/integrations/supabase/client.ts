/**
 * Supabaseクライアントの初期化ファイル。
 * このファイルは自動生成されています。直接編集しないでください。
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types'; // Supabaseの型定義

// Viteの環境変数からSupabaseのURLと公開キーを取得
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/**
 * Supabaseクライアントのインスタンス。
 * アプリケーション全体でこのインスタンスをインポートして使用します。
 * 例: import { supabase } from "@/integrations/supabase/client";
 */
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  // 認証に関する設定
  auth: {
    // セッション情報を永続化するためのストレージとしてlocalStorageを使用
    storage: localStorage,
    // ページをリロードしてもセッションを維持する
    persistSession: true,
    // アクセストークンを自動的に更新する
    autoRefreshToken: true,
  }
});