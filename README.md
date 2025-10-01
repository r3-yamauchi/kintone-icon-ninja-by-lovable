# Kintone Icon Ninja on Lovable

## 概要

Kintone Icon Ninjaは、kintoneアプリのアイコンをAIで簡単に作成するためのWebアプリケーションです。
テキストで説明を入力するだけで、kintoneの仕様に最適化された高品質なアイコンを生成できます。

### 主な機能

- **AIによるアイコン生成**: テキスト記述からアイコン画像を生成します。
- **複数スタイルの提案**: 「3D立体感」「フラット」「シンプル」「カラフル」の4つの異なるデザインスタイルを一度に生成し、比較検討できます。
- **kintoneへの最適化**: 生成されるアイコンは、kintoneの推奨サイズである56x56ピクセルに最適化されています。
- **簡単なダウンロード**: 気に入ったアイコンはワンクリックでダウンロードできます。

---

## ローカルでの開発手順

このプロジェクトをローカル環境でセットアップする手順です。

### 前提条件

- [Node.js](https://nodejs.org/) (LTS版を推奨)
- [npm](https://www.npmjs.com/) (Node.jsに同梱)

### セットアップ

1.  **リポジトリをクローン**

    ```sh
    git clone <YOUR_GIT_URL>
    ```

2.  **ディレクトリに移動**

    ```sh
    cd kintone-icon-ninja-by-lovable
    ```

3.  **依存関係をインストール**

    ```sh
    npm install
    ```

4.  **開発サーバーを起動**

    ```sh
    npm run dev
    ```

    起動後、ブラウザで `http://localhost:5173` （またはターミナルに表示されたアドレス）にアクセスすると、アプリケーションが表示されます。

---

## 技術スタックとアーキテクチャ

### 技術スタック

- **フロントエンド**: React, Vite, TypeScript
- **UI**: shadcn/ui, Tailwind CSS
- **状態管理**: TanStack Query
- **バックエンド**: Supabase (Edge Functions)

### アーキテクチャ

このアプリケーションは、React製のフロントエンドとSupabaseのサーバーレス関数を組み合わせた構成です。

1.  **フロントエンド (`src`)**
    ユーザーは `IconGenerator.tsx` コンポーネントを通じてアイコンの説明を入力します。生成ボタンが押されると、入力されたテキストをペイロードとしてSupabaseのEdge Functionを呼び出します。

2.  **バックエンド (`supabase/functions/generate-icon`)**
    リクエストを受け取ったEdge Functionは、Denoランタイム上で動作します。この関数は、ユーザーの入力に加えてkintoneアイコンの仕様（56x56px、高い視認性など）を満たすための詳細な指示を組み合わせ、4つの異なるデザインスタイル（3D, フラット, シンプル, カラフル）のプロンプトを生成します。

3.  **AI連携**
    生成された4つのプロンプトは、Lovable AI Gateway APIに並列で送信されます。AI（`google/gemini-2.5-flash-image-preview`モデル）が各プロンプトに基づいた画像を生成します。

4.  **レスポンス**
    AIが生成した4つの画像のURLがEdge Functionからフロントエンドに返却され、画面に表示されます。ユーザーは表示された画像の中から好きなものをダウンロードできます。

---

## Lovableプラットフォーム

このプロジェクトは[Lovable](https://lovable.dev/)プラットフォーム上で作成・管理されています。

- **デプロイ**: Lovableの管理画面から「Share -> Publish」をクリックするだけでデプロイが可能です。
- **カスタムドメイン**: Lovableのプロジェクト設定からカスタムドメインを接続できます。詳細は[公式ドキュメント](https://docs.lovable.dev/features/custom-domain#custom-domain)を参照してください。
