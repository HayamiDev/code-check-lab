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
        content: `あなたはコードレビューの専門家です。以下の条件でコードレビュー練習問題を生成してください。

言語: ${language}
レベル: ${level}/10 (10が最高難度)

以下のJSON形式で回答してください:
{
  "prerequisite": "レビュー対象コードの前提条件（システム概要など。必要な場合のみ記載）",
  "code": "レビュー対象のコード",
  "level": ${level},
  "requiredIssuesCount": 3,
  "requiredIssues": [
    {
      "summary": "指摘の概要",
      "detail": "詳細な解説"
    }
  ],
  "optionalIssues": [
    {
      "summary": "任意指摘の概要",
      "detail": "詳細な解説"
    }
  ]
}

注意点:
- レベルに応じて問題の難易度を調整してください
- 必須指摘は2〜4個程度
- 任意指摘は1〜3個程度
- 実際のコードレビューで遭遇しそうな現実的な問題を含めてください
- セキュリティ、パフォーマンス、保守性、可読性など多様な観点を含めてください`
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
        content: `以下のコードレビュー問題に対するユーザーの回答を採点してください。

【レビュー対象コード】
${problem.code}

【必須指摘事項】
${problem.requiredIssues.map((issue, i) => `${i + 1}. ${issue.summary}\n   ${issue.detail}`).join('\n\n')}

【ユーザーの回答】
${userAnswer}

各必須指摘に対して0〜10点で採点し、以下のJSON形式で回答してください:
{
  "scores": [
    {
      "issueIndex": 0,
      "score": 8,
      "feedback": "この指摘についての評価コメント"
    }
  ],
  "totalScore": 75,
  "overallFeedback": "全体的な講評"
}

採点基準:
- 指摘の意図が正確に理解できている: 10点
- 指摘の意図は理解できているが説明不足: 6〜8点
- 指摘の方向性は合っているが不十分: 3〜5点
- 指摘できていない、または的外れ: 0〜2点
- totalScoreは全指摘の平均点（0〜100のパーセンテージ）`
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
