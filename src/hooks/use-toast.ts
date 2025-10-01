/**
 * このファイルは、shadcn/uiのToastコンポーネントを制御するためのカスタムフック `useToast` を提供します。
 * アプリケーション全体で状態を共有するために、ReactのContextではなく、
 * 外部のストア（リスナーパターン）を使用しています。これにより、プロバイダーのネストを回避できます。
 * 
 * 元コード: https://github.com/shadcn-ui/ui/blob/main/apps/www/hooks/use-toast.ts
 */

import * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

// 同時に表示できるトーストの最大数
const TOAST_LIMIT = 1;
// トーストが自動的にDOMから削除されるまでの遅延時間（非常に大きな値で実質無効化）
const TOAST_REMOVE_DELAY = 1000000;

// Toasterで管理されるトーストの型定義
type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

// アクションの型を定義
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST", // トーストを非表示にするアクション
  REMOVE_TOAST: "REMOVE_TOAST",  // トーストをDOMから削除するアクション
} as const;

// トーストIDを生成するためのカウンター
let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

// Reducerが受け取るActionの型定義
type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

// ストアの状態の型定義
interface State {
  toasts: ToasterToast[];
}

// 各トーストの削除タイマーを管理するMap
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

// 状態を更新するためのReducer関数
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // 副作用: 指定されたトースト（または全トースト）を削除キューに追加
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false, // トーストを非表示にする
              }
            : t,
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

// 状態の変更を購読するリスナーの配列
const listeners: Array<(state: State) => void> = [];

// グローバルな状態を保持する変数
let memoryState: State = { toasts: [] };

// アクションをディスパッチして状態を更新し、リスナーに通知する
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, "id">;

/**
 * 新しいトーストを表示するための関数
 * @param props トーストのプロパティ (title, description, variantなど)
 * @returns トーストを制御するためのオブジェクト (id, dismiss, update)
 */
function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

/**
 * トーストの状態とアクションにアクセスするためのカスタムフック
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    // コンポーネントのマウント時にリスナーを追加
    listeners.push(setState);
    // コンポーネントのアンマウント時にリスナーを削除
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };