# kintone Icon Ninja (App Icon Maker) on Lovable with Google Gemini 2.5 Flash Image (nano-banana)

## 概要

kintone Icon Ninjaは、kintoneアプリのアイコンをAIで簡単に作成するためのWebアプリケーションです。
テキストで説明を入力するだけで、kintoneの仕様に最適化された高品質なアイコンを生成できます。

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/r3-yamauchi/kintone-icon-ninja-by-lovable)

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
    リクエストを受け取ったEdge Functionは、Denoランタイム上で動作します。この関数が、AIとの連携をはじめとする全てのバックエンド処理を実行します。

#### Supabase Edge Functionの目的

バックエンドとしてSupabase Edge Functionを採用している主な目的は以下の通りです。

- **APIキーの安全な管理**: AIへのリクエストに必要なAPIキーをクライアント（ブラウザ）に公開することなく、安全なサーバー環境に保管します。これがFunctionを利用する最も重要な理由です。
- **プロンプトエンジニアリングの集約**: ユーザーの単純な入力から、AI向けの高品質で複雑なプロンプト（指示文）を生成するロジックを集約します。
- **APIの抽象化**: フロントエンドはAIの仕様（モデル名、API形式など）を意識する必要がなくなります。将来AIのモデルを変更する場合でも、修正はFunction内だけで完結します。
- **処理の効率化**: 4種類のデザインスタイルをAIにリクエストする際、各リクエストを並列で実行することで、全体の処理時間を短縮しています。

### AIへのプロンプト設計

AIに送信するプロンプトは、`supabase/functions/generate-icon/index.ts` 内で動的に生成されます。最終的なプロンプトは「ユーザーの入力」「共通の基本要件」「スタイルごとの指示」の3要素で構成されます。

#### 1. 共通の基本要件

kintoneアイコンとしての品質を担保するため、すべてのプロンプトには以下の厳格な基本要件が含まれています。

```
CRITICAL IMAGE SPECIFICATIONS (MUST FOLLOW):
- Generate EXACTLY 56 pixels × 56 pixels (56px × 56px) - THIS IS MANDATORY
- The image MUST be 56x56px, not larger. This is a small icon size.
- Design specifically for tiny 56x56px display - use bold, clear shapes
- Icon-style illustration optimized for small size (not photo-realistic)
- Centered composition with clear focus
- Business/enterprise aesthetic suitable for kintone app icons
- Maximum contrast and extremely clear visibility at 56x56px
- Simple, bold design that remains recognizable at tiny size
- No fine details that would be lost at 56x56px
- No text or labels in the image
- Design MUST work perfectly at exactly 56 pixels × 56 pixels
```

（日本語参考訳）
```
重要な画像仕様（必ず遵守すること）:
- 正確に56ピクセル × 56ピクセル（56px × 56px）で生成すること ―― これは必須条件です
- 画像は必ず56x56pxであり、それ以上の大きさではいけません。これは小さなアイコンサイズです
- 特に小さな56x56px表示用にデザインすること ―― 太く、はっきりとした形状を使用すること
- 小サイズに最適化されたアイコン風イラスト（写実的ではないもの）
- 中央揃えの構図で明確な焦点を持つこと
- kintoneアプリアイコンにふさわしいビジネス／エンタープライズの美的感覚
- 56x56pxで最大限のコントラストと非常に明確な視認性
- 小さなサイズでも認識できる、シンプルで太いデザイン
- 56x56pxで失われるような細かいディテールは禁止
- 画像にテキストやラベルを入れてはいけない
- デザインは正確に56ピクセル × 56ピクセルで完全に機能しなければならない
```

#### 2. スタイルごとの指示

基本要件に加え、以下の4つのスタイルそれぞれに特化した指示が追加されます。

- **3D立体感**: シンプルな3Dレンダリング、光沢や金属的な質感、モダンな外観を指示。
- **フラット**: 単色と太い線で構成される純粋なフラットデザイン、色間の強いコントラストを指示。
- **シンプル**: 最小限の線画や単色、1〜2色のハイコントラストで構成される最大限シンプルなデザインを指示。
- **カラフル**: 鮮やかで大胆な3〜5色を使い、強いグラデーションや明確なカラーブロックを持つデザインを指示。

この設計により、ユーザーの多様なニーズに応えつつ、kintoneアイコンとして一貫した品質の画像を生成することを可能にしています。

---

## アプリケーション全体の処理フローと実装詳細

このセクションでは、フロントエンドとバックエンドをまたいだ処理の流れを時系列で追いながら、実装上のポイントを掘り下げて解説します。

### 1. エントリーポイントとアプリケーションコンテナ

- `src/main.tsx`
  - Viteが用意する`index.html`の`<div id="root">`を取得し、`createRoot(...).render(<App />)`でReactツリーを起動します。
  - ここで読み込まれる`App`コンポーネントが、以降のプロバイダー構成とルーティングの土台になります。
- `src/App.tsx`
  - `QueryClientProvider`によりTanStack Queryのキャッシュレイヤーを全体に供給し、将来的なデータフェッチに備えています（現状はAI生成APIのみですが、状態管理の統一が可能）。
  - `TooltipProvider`と2種類の`Toaster`（shadcn/uiおよびSonner）を配置し、UIフィードバックを制御します。
  - `BrowserRouter`でページ遷移を定義し、`/`は`Index`、それ以外は`NotFound`へフォールバックする最小構成です。

### 2. 画面構成とUIレイアウト

- `src/pages/Index.tsx`
  - Lucideの`Palette`アイコンを添えたヒーローセクション、説明文、`IconGenerator`の呼び出しというシンプルな構造です。
  - 背景はTailwind CSSのグラデーションユーティリティで演出し、主要操作に集中できるよう余計なコンテンツを避けています。
- `src/pages/NotFound.tsx`
  - 未定義ルートに遷移したときのバックストップ。`useEffect`で404アクセスをログ出力するのみの軽量実装です。

### 3. アイコン生成フロー（フロントエンド）

- `src/components/IconGenerator.tsx`
  - **状態管理**: ユーザー入力（`description`）、生成結果リスト（`images`）、処理中フラグ（`isGenerating`）を`useState`で保持。`useToast`フックでトースト通知を発火します。
  - **入力補助**: よく使う説明文をボタン化した`examples`配列を用意し、ワンクリックでテキストをセットできます。
  - **バリデーションとUX**: 空文字の場合は即座にトーストで警告し、生成ボタンも`disabled`にすることで無駄なAPI呼び出しを防ぎます。生成中はスピナーとボタンロックで処理中であることを明示します。
  - **API呼び出し**: `supabase.functions.invoke('generate-icon', { body: { description } })`でEdge Functionを呼び出します。成功時は`data.images`を描画ステートに保存し、失敗時は例外を捕捉してエラートーストを表示します。
  - **結果表示とダウンロード**: 4種類のスタイルをグリッド表示し、`Download`アイコン付きボタンから`<a>`要素を動的生成→クリックすることでブラウザ標準のダウンロードを誘発します。ファイル名にはスタイル名と`Date.now()`を付与し、衝突を回避します。

### 4. Supabase Edge Functionによるバックエンド処理

- `supabase/functions/generate-icon/index.ts`
  - **リクエスト受付**: `serve`でHTTPリクエストを待ち受け、CORSプリフライト（`OPTIONS`）に即応したうえで`POST`ボディから`description`を取得します。
  - **認証情報の管理**: Lovable AI Gatewayのキー（`LOVABLE_API_KEY`）はEdge Functionの環境変数に保持し、クライアントへ露出させません。未設定時は明示的にエラーを投げます。
  - **プロンプト生成**: README前半で説明した共通要件文字列をベースに、4つのスタイルごとの追加指示をテンプレート化。ユーザー入力を差し込んだ完全なプロンプトを作成します。
  - **並列実行**: `Promise.all`で4スタイル分のリクエストを並列化。Lovable AI Gateway（`https://ai.gateway.lovable.dev/v1/chat/completions`）に対して同一モデル（`google/gemini-2.5-flash-image-preview`）を指定し、画像生成を依頼します。
  - **レスポンス解析とエラーハンドリング**: HTTPエラー時はステータスコード毎に詳細な例外メッセージ（429: レート制限、402: クレジット不足）を投げ、他のケースはAPIレスポンス本文を含む汎用エラーを生成します。画像URLが欠落した場合も例外を発生させ、フロント側で捕捉できるようにしています。
  - **レスポンス返却**: 成功時は`{ images: [{ style, imageUrl }, ...] }`をJSONで返し、CORSヘッダーと`Content-Type`を明示します。

### 5. Supabaseクライアント設定

- `src/integrations/supabase/client.ts`
  - Viteの環境変数`VITE_SUPABASE_URL`と`VITE_SUPABASE_PUBLISHABLE_KEY`を使用して`createClient`を初期化。Edge Function呼び出しを行うために用意されています。
  - 認証設定は`localStorage`でセッションを保持する構成ですが、本アプリでは匿名利用のため主に関数呼び出しに利用しています。

### 6. UXを支える補助機能

- `src/hooks/use-toast.ts`
  - shadcn/ui由来のトーストマネージャをカスタムフックとして内蔵し、グローバル状態でトーストを一元管理します。アイコン生成とダウンロードの成功・失敗をここから通知しています。
- Lucide Icons, Tailwind CSS, shadcn/ui
  - ボタンやカードはshadcn/uiのプリミティブを採用し、Tailwindのユーティリティクラスで細かい装飾を追加。視覚的な一貫性と実装スピードを両立しています。

### 7. セキュリティと運用上の注意

- Edge FunctionにAPIキーを隠蔽することで、フロントエンドは無署名の`description`のみを送信するシンプルな設計になっています。
- Lovable AI Gatewayのレート制限・クレジット不足は即座に検知され、ユーザーに日本語メッセージが返るよう実装済みです。
- 生成画像はLovableが発行する一時URLをそのまま利用するため、長期保存が必要な場合は別途ストレージ連携を追加する設計余地があります。

以上が、kintone Icon Ninja全体の処理シーケンスと各モジュールの役割です。フロントエンドとサーバレス関数を疎結合に保つことで、将来的なAIモデル変更やUIの拡張にも柔軟に対応できる構造になっています。

---

## Lovableプラットフォーム

このプロジェクトは[Lovable](https://lovable.dev/)プラットフォーム上で作成・管理されています。

- **デプロイ**: Lovableの管理画面から「Share -> Publish」をクリックするだけでデプロイが可能です。
- **カスタムドメイン**: Lovableのプロジェクト設定からカスタムドメインを接続できます。詳細は[公式ドキュメント](https://docs.lovable.dev/features/custom-domain#custom-domain)を参照してください。
