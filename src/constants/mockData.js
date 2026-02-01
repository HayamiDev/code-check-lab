export const MOCK_PROBLEM = {
  language: "JavaScript",
  prerequisite: "ユーザー認証を行うWebアプリケーションのログイン処理です。",
  code: `function login(username, password) {
  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
  const result = db.execute(query);

  if (result.length > 0) {
    session.user = result[0];
    return true;
  }
  return false;
}

function hashPassword(password) {
  return md5(password);
}`,
  level: 5,
  requiredIssuesCount: 3,
  requiredIssues: [
    {
      summary: "SQLインジェクションの脆弱性",
      detail: "ユーザー入力を直接SQL文に結合しているため、SQLインジェクション攻撃に対して脆弱です。プリペアドステートメントやパラメータ化クエリを使用すべきです。"
    },
    {
      summary: "パスワードの平文保存",
      detail: "パスワードをハッシュ化せずにデータベースと比較しています。パスワードは保存時にハッシュ化し、比較時もハッシュ値同士で行うべきです。"
    },
    {
      summary: "MD5の使用",
      detail: "MD5は暗号学的に安全ではありません。bcryptやArgon2などの安全なハッシュアルゴリズムを使用すべきです。"
    }
  ],
  optionalIssues: [
    {
      summary: "エラーハンドリングの不足",
      detail: "データベース接続エラーやクエリエラーに対する例外処理がありません。"
    }
  ]
}

export const MOCK_EVALUATION = {
  scores: [
    {
      issueIndex: 0,
      score: 9,
      feedback: "SQLインジェクションの脆弱性を正確に指摘できています。プリペアドステートメントへの言及もあり、良い回答です。"
    },
    {
      issueIndex: 1,
      score: 7,
      feedback: "パスワードの扱いについて指摘できていますが、具体的な改善方法についてもう少し詳しく説明があるとより良いです。"
    },
    {
      issueIndex: 2,
      score: 5,
      feedback: "MD5の問題点には触れていましたが、代替案の提示が不足しています。"
    }
  ],
  totalScore: 70,
  overallFeedback: "セキュリティの観点から主要な問題点を概ね把握できています。SQLインジェクションの指摘は特に的確でした。今後は、指摘に対する具体的な改善案も併せて提示できるとより実践的なレビューになります。"
}
