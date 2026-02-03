const API_ENDPOINT = 'https://code-review-trainer-api.wakanatsuki787.workers.dev/'

export async function generateProblem(language, level) {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: `あなたは世界トップクラスのテック企業で働くシニアエンジニア（テックリード）です。
新人から中堅エンジニアの育成のために、コードレビューの練習問題を作成してください。

【設定】
言語: ${language}
難易度レベル: ${level}/10

【レベルの目安】
1-3: 基本的な構文エラー、明らかなバグ、コードスタイル違反
4-7: パフォーマンスの問題、エッジケースの考慮不足、セキュリティの軽微な欠陥、一般的なアンチパターン
8-10: 設計上の欠陥（SOLID原則違反など）、並行処理のバグ、複雑なセキュリティホール、スケーラビリティの問題

【要件】
1. 指定された言語の慣習（Idiom）やベストプラクティスに基づいたコードを作成してください。
2. コードは一見正しく動作しそうに見えるが、実際には問題を含んでいるものにしてください。
3. "requiredIssues"（必須の指摘箇所）には、そのレベルに相応しい重要な欠陥を含めてください。
4. "optionalIssues"（任意の指摘箇所）には、可読性の向上やモダンな書き方へのリファクタリング提案など、より高度な視点を含めてください。

【出力形式】
JSON形式のみを出力してください。Markdownのコードブロックは不要です。
{
  "prerequisite": "コードの前提条件（関数が呼ばれるコンテキストや、ビジネス要件など）",
  "code": "レビュー対象のソースコード（文字列）",
  "level": ${level},
  "requiredIssuesCount": 必須指摘の数,
  "requiredIssues": [
    {
      "summary": "指摘の要約（簡潔に）",
      "detail": "なぜそれが問題なのか、どう修正すべきかの技術的な解説"
    }
  ],
  "optionalIssues": [
    {
      "summary": "指摘の要約",
      "detail": "より良いコードにするための提案と解説"
    }
  ]
}`
      }]
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || `APIエラー: ${response.status}`)
  }

  const data = await response.json()
  const content = data.content?.find(c => c.type === 'text')?.text || ''

  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0])
  }
  throw new Error('問題の生成に失敗しました')
}

export async function evaluateAnswer(problem, userAnswer) {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [{
        role: 'user',
        content: `あなたはコードレビューの指導官です。ユーザーが行ったコードレビュー（指摘内容）を厳格に採点し、フィードバックを行ってください。

【レビュー対象コード】
${problem.code}

【正解となる指摘事項 (必須)】
${problem.requiredIssues.map((issue, i) => `${i + 1}. ${issue.summary}\n   詳細: ${issue.detail}`).join('\n\n')}

【ユーザーの回答】
${userAnswer}

【採点指示】
1. ユーザーの回答を、あらかじめ用意された「正解となる指摘事項」と照らし合わせてください。
2. 各指摘について、以下の基準で0〜10点のスコアを付けてください。
   - 10点: 問題の核心を突き、かつ修正案や理由が論理的で明確である。
   - 7-9点: 問題の指摘は正しいが、理由の説明がやや不足している。
   - 4-6点: なんとなく問題があることは指摘しているが、核心を突いていない、または理由が誤っている。
   - 0-3点: 指摘が含まれていない、または完全に的外れである。
3. ユーザーが「正解」に含まれないが、妥当で価値のある指摘をした場合、それは加点要素として考慮し、overallFeedbackで言及してください。

【出力形式】
JSON形式のみを出力してください。Markdownのコードブロックは不要です。
{
  "scores": [
    {
      "issueIndex": 0, // requiredIssuesのインデックスに対応
      "score": 点数,
      "feedback": "あなたの指摘に対する講評。不足していた点や、良かった点具体的に。"
    }
  ],
  "totalScore": 総合スコア（0〜100点）,
  "overallFeedback": "全体的なフィードバック。エンジニアとしての成長につながるアドバイスを含めてください。"
}`
      }]
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || `APIエラー: ${response.status}`)
  }

  const data = await response.json()
  const content = data.content?.find(c => c.type === 'text')?.text || ''

  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0])
  }
  throw new Error('評価に失敗しました')
}
