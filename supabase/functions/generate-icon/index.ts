/**
 * Supabase Edge Function: generate-icon
 * このファンクションは、ユーザーから受け取った説明を元に、
 * Lovable AI Gatewayを通じて複数のスタイルのkintone用アイコン画像を生成します。
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS（Cross-Origin Resource Sharing）ヘッダー
// ブラウザからの異なるオリジンへのリクエストを許可するために必要
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // すべてのオリジンを許可
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', // 許可するヘッダー
};

// Denoのserve関数でHTTPリクエストを待ち受けます
serve(async (req) => {
  // OPTIONSメソッドはCORSのプリフライトリクエスト。CORSヘッダーを付けて200 OKを返す
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // リクエストボディからJSONをパースして`description`を取得
    const { description } = await req.json();
    console.log('Generating icon with description:', description);

    // 環境変数からLovable APIキーを取得
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // AIに渡すプロンプトの共通要件
    // kintoneアイコンの仕様に準拠させるための厳格な指示
    const baseRequirements = `
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
- Design MUST work perfectly at exactly 56 pixels × 56 pixels`;

    // 生成する4つの異なる画像スタイルを定義
    const styles = [
      {
        name: "3D立体感",
        prompt: `Generate a 56px × 56px icon for: ${description}\n\n${baseRequirements}\n\nStyle: 3D立体感のあるデザイン (optimized for 56x56px)\n- Simple 3D rendering with clear depth (not too complex for small size)\n- Bold glossy or metallic surface effects\n- Strong lighting and highlights visible at tiny size\n- Modern and polished appearance with clear shapes`
      },
      {
        name: "フラット",
        prompt: `Generate a 56px × 56px icon for: ${description}\n\n${baseRequirements}\n\nStyle: フラットデザイン (optimized for 56x56px)\n- Pure flat design with bold, solid colors\n- Strong contrast between colors\n- Large, simple geometric shapes (no tiny details)\n- Minimalist and extremely clear at small size\n- Material design inspired with bold elements`
      },
      {
        name: "シンプル",
        prompt: `Generate a 56px × 56px icon for: ${description}\n\n${baseRequirements}\n\nStyle: ごくシンプルなアイコン (optimized for 56x56px)\n- Bold minimal line art or single solid color\n- Maximum simplicity with 1-2 high-contrast colors\n- Thick, clear outlines or bold silhouettes\n- Only the most essential elements\n- Perfect legibility at tiny 56x56px size`
      },
      {
        name: "カラフル",
        prompt: `Generate a 56px × 56px icon for: ${description}\n\n${baseRequirements}\n\nStyle: カラフルで多彩 (optimized for 56x56px)\n- Vibrant bold colors (3-5 distinct colors, clearly visible)\n- Strong gradients with clear color blocks\n- Expressive but not overly detailed for small size\n- Eye-catching with bold color contrast\n- Playful yet professional with clear shapes`
      }
    ];

    console.log('Calling Lovable AI Gateway for 4 different styles...');
    
    // 4つのスタイルすべての画像生成を並列で実行
    const generatePromises = styles.map(async (style) => {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview", // 使用するAIモデル
          messages: [
            {
              role: "user",
              content: style.prompt // 各スタイルのプロンプト
            }
          ],
          modalities: ["image", "text"] // 画像とテキストを扱うモード
        }),
      });

      // APIからのレスポンスが正常でない場合のエラーハンドリング
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`AI gateway error for ${style.name}:`, response.status, errorText);
        
        // レート制限エラー
        if (response.status === 429) {
          throw new Error("レート制限に達しました。しばらく待ってから再度お試しください。");
        }
        
        // クレジット不足エラー
        if (response.status === 402) {
          throw new Error("クレジットが不足しています。Lovable AIワークスペースに資金を追加してください。");
        }
        
        throw new Error(`AI Gateway error: ${response.status} ${errorText}`);
      }

      // レスポンスから画像URLを抽出
      const data = await response.json();
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      
      if (!imageUrl) {
        throw new Error(`No image was generated for style: ${style.name}`);
      }

      // スタイル名と画像URLを返す
      return { style: style.name, imageUrl };
    });

    // すべての並列処理が完了するのを待つ
    const results = await Promise.all(generatePromises);
    console.log('All 4 styles generated successfully');

    // 成功レスポンスを返す
    return new Response(
      JSON.stringify({ images: results }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    // 関数全体のエラーハンドリング
    console.error("Error in generate-icon function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});