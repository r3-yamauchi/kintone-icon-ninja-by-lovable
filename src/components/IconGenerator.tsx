/**
 * アイコンジェネレーターのメインコンポーネント。
 * ユーザーからの入力を受け取り、AIによるアイコン生成を実行し、結果を表示します。
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Download, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// 生成された画像の型定義
interface GeneratedImage {
  style: string; // 画像のスタイル名（例: "3D立体感", "フラット"）
  imageUrl: string; // 生成された画像のURL
}

export const IconGenerator = () => {
  // ステート変数の定義
  const [description, setDescription] = useState(""); // ユーザーが入力したアイコンの説明
  const [images, setImages] = useState<GeneratedImage[]>([]); // 生成された画像のリスト
  const [isGenerating, setIsGenerating] = useState(false); // 生成処理が実行中かどうかを示すフラグ
  const { toast } = useToast(); // トースト通知を表示するためのフック

  /**
   * 「アイコンを生成」ボタンがクリックされたときの処理
   */
  const handleGenerate = async () => {
    // 説明が未入力の場合はエラーメッセージを表示して処理を中断
    if (!description.trim()) {
      toast({
        title: "入力エラー",
        description: "アイコンの説明を入力してください",
        variant: "destructive",
      });
      return;
    }

    // 生成処理開始のフラグを立て、既存の画像リストをクリア
    setIsGenerating(true);
    setImages([]);

    try {
      // Supabase Functions の 'generate-icon' を呼び出す
      const { data, error } = await supabase.functions.invoke('generate-icon', {
        body: { description: description.trim() } // 入力された説明をリクエストボディに含める
      });

      // Functionの呼び出しでエラーが発生した場合は例外を投げる
      if (error) throw error;

      // レスポンスデータに画像配列が含まれていれば、ステートを更新
      if (data?.images && Array.isArray(data.images)) {
        setImages(data.images);
        toast({
          title: "生成完了",
          description: "4つのアイコンが正常に生成されました",
        });
      } else {
        // 予期せぬレスポンス形式の場合
        throw new Error("画像が生成されませんでした");
      }
    } catch (error) {
      // エラーハンドリング
      console.error('Error generating icon:', error);
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "アイコンの生成に失敗しました",
        variant: "destructive",
      });
    } finally {
      // 処理が成功しても失敗しても、生成中フラグを解除
      setIsGenerating(false);
    }
  };

  /**
   * 「ダウンロード」ボタンがクリックされたときの処理
   * @param imageUrl ダウンロードする画像のURL
   * @param style 画像のスタイル名（ファイル名に使用）
   */
  const handleDownload = (imageUrl: string, style: string) => {
    // aタグを動的に作成してクリックさせることでダウンロードを実現
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `kintone-icon-${style}-${Date.now()}.png`; // ファイル名を指定
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "ダウンロード開始",
      description: `${style}アイコンをダウンロードしています`,
    });
  };

  // 入力例のリスト
  const examples = [
    "顧客管理のアイコン",
    "プロジェクト管理のアイコン",
    "営業日報のアイコン",
    "勤怠管理のアイコン"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* アイコン説明入力フォーム */}
      <Card className="p-6 glass-effect border-2">
        <div className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              アイコンの説明を入力してください
            </label>
            <Textarea
              id="description"
              placeholder="例: 顧客管理のアイコン。青い色で人のシルエットを使ったシンプルなデザイン"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] text-base"
              disabled={isGenerating}
            />
          </div>

          {/* 入力例を表示するボタン */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">例:</span>
            {examples.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setDescription(example)} // クリックで入力欄にテキストをセット
                disabled={isGenerating}
                className="text-xs"
              >
                {example}
              </Button>
            ))}
          </div>

          {/* アイコン生成ボタン */}
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !description.trim()} // 生成中または未入力の場合は無効化
            className="w-full gradient-primary hover:opacity-90 transition-opacity"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                アイコンを生成
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* 生成されたアイコンの表示エリア */}
      {images.length > 0 && (
        <Card className="p-6 glass-effect border-2 animate-in fade-in-50 duration-500">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-center">生成されたアイコン（56px × 56px）</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {images.map((image, index) => (
                <div key={index} className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    {/* アイコンの背景にぼかし効果を追加 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg blur-xl group-hover:blur-2xl transition-all" />
                    {/* アイコン画像コンテナ */}
                    <div className="relative bg-white rounded-lg p-4 shadow-large border-2 border-border">
                      <img
                        src={image.imageUrl}
                        alt={`${image.style}アイコン`}
                        className="w-32 h-32 object-contain"
                      />
                    </div>
                  </div>
                  <div className="text-center space-y-2 w-full">
                    <p className="text-sm font-medium text-muted-foreground">{image.style}</p>
                    {/* ダウンロードボタン */}
                    <Button 
                      onClick={() => handleDownload(image.imageUrl, image.style)}
                      variant="secondary"
                      size="sm"
                      className="w-full"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      ダウンロード
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};