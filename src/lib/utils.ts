/**
 * Tailwind CSSのクラス名を結合・マージするためのユーティリティ関数。
 * shadcn/uiでよく使われるヘルパーです。
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 複数のクラス名（文字列、配列、オブジェクト）を受け取り、
 * 条件に応じてクラス名を結合し、Tailwind CSSの競合するクラスをマージして、
 * 最終的なクラス名の文字列を生成します。
 *
 * @param inputs - 結合・マージしたいクラス名のリスト。
 * @returns マージされた単一のクラス名文字列。
 *
 * @example
 * cn("p-4", "font-bold", { "bg-red-500": hasError });
 * // => "p-4 font-bold bg-red-500" (hasErrorがtrueの場合)
 *
 * @example
 * cn("p-4", "p-2");
 * // => "p-2" (tailwind-mergeにより後のクラスが優先される)
 */
export function cn(...inputs: ClassValue[]) {
  // clsx: 複数のクラス名ソースを単一の文字列に結合する
  // twMerge: Tailwind CSSのクラスをマージし、競合を解決する
  return twMerge(clsx(inputs));
}