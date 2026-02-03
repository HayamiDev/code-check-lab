export const LANGUAGES = [
  'Kotlin',
  'Swift',
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C#',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  'C++'
]

// 言語名からhighlight.jsのクラス名へのマッピング
export const LANGUAGE_TO_HLJS = {
  'Kotlin': 'kotlin',
  'Swift': 'swift',
  'JavaScript': 'javascript',
  'TypeScript': 'typescript',
  'Python': 'python',
  'Java': 'java',
  'C#': 'csharp',
  'Go': 'go',
  'Rust': 'rust',
  'PHP': 'php',
  'Ruby': 'ruby',
  'C++': 'cpp'
}

export interface LanguageInfo {
  description: string
  tags: string[]
  docUrl: string
  reviewTips: string[]
  frameworks: string[]
  stats: {
    performance: number // 1-5: 5 is highest/fastest
    safety: number      // 1-5: 5 is safest/strictest
    difficulty: number  // 1-5: 5 is hardest
  }
}

export const LANGUAGE_DESCRIPTIONS: Record<string, LanguageInfo> = {
  Kotlin: {
    description: "JetBrainsが開発した、Javaと完全な相互運用性を持つモダンな静的型付け言語。",
    tags: ["Android Dev", "Server-side", "Multiplatform"],
    docUrl: "https://kotlinlang.org/docs/home.html",
    reviewTips: ["Null許容型（?）の適切なハンドリング", "Coroutinesのスコープと例外処理", "data classの活用とcopyメソッド"],
    frameworks: ["Spring Boot", "Ktor", "Jetpack Compose"],
    stats: { performance: 4, safety: 5, difficulty: 3 }
  },
  Swift: {
    description: "Appleが開発した、iOS, macOS, watchOS, tvOS向けの強力で直感的なプログラミング言語。",
    tags: ["iOS Apps", "macOS", "System"],
    docUrl: "https://www.swift.org/documentation/",
    reviewTips: ["循環参照（Retain Cycle）とweak/unowned", "Guard文による早期リターン", "Optional Chainingの活用"],
    frameworks: ["SwiftUI", "UIKit", "Vapor"],
    stats: { performance: 4, safety: 5, difficulty: 3 }
  },
  JavaScript: {
    description: "Webブラウザで動作する標準的なプログラミング言語。フロントエンドからサーバーサイドまで幅広く利用される。",
    tags: ["Frontend", "Node.js", "Web Apps"],
    docUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript",
    reviewTips: ["厳密等価演算子（===）の使用", "非同期処理（Promise/Async）のエラー処理", "変数のスコープ（const/let）"],
    frameworks: ["React", "Vue", "Next.js", "Express"],
    stats: { performance: 3, safety: 1, difficulty: 2 }
  },
  TypeScript: {
    description: "Microsoftが開発したJavaScriptのスーパーセット。静的型付けにより大規模開発に適している。",
    tags: ["Frontend", "Enterprise", "Type Safety"],
    docUrl: "https://www.typescriptlang.org/docs/",
    reviewTips: ["any型の使用回避と適切な型定義", "Discriminated Unionsの活用", "Null/Undefinedの厳密なチェック"],
    frameworks: ["React", "Angular", "NestJS"],
    stats: { performance: 3, safety: 4, difficulty: 3 }
  },
  Python: {
    description: "シンプルで読みやすい構文が特徴。データサイエンス、AI、Web開発など多岐にわたる分野で人気。",
    tags: ["AI/ML", "Data Science", "Backend"],
    docUrl: "https://docs.python.org/3/",
    reviewTips: ["リスト内包表記の可読性", "ミュータブルなデフォルト引数の回避", "Type Hints（型ヒント）の活用"],
    frameworks: ["Django", "FastAPI", "PyTorch", "Pandas"],
    stats: { performance: 2, safety: 3, difficulty: 1 }
  },
  Java: {
    description: "「一度書けばどこでも動く」を理念とする、堅牢でプラットフォームに依存しないオブジェクト指向言語。",
    tags: ["Enterprise", "Android", "Large Systems"],
    docUrl: "https://docs.oracle.com/en/java/",
    reviewTips: ["NullPointerExceptionの防止（Optional）", "Stream APIの適切な使用", "例外処理の粒度とログ"],
    frameworks: ["Spring Boot", "Jakarta EE", "Hibernate"],
    stats: { performance: 4, safety: 4, difficulty: 3 }
  },
  'C#': {
    description: "Microsoftが開発した、.NETフレームワーク向けの強力な言語。ゲーム開発や業務アプリに強い。",
    tags: ["Unity / Game", "Windows", "Enterprise"],
    docUrl: "https://learn.microsoft.com/ja-jp/dotnet/csharp/",
    reviewTips: ["LINQクエリのパフォーマンスと遅延実行", "async/awaitのデッドロック回避", "Null許容参照型の活用"],
    frameworks: ["ASP.NET Core", "Unity", "Blazor"],
    stats: { performance: 4, safety: 4, difficulty: 3 }
  },
  Go: {
    description: "Googleが開発した、シンプルで高速なコンパイル言語。並行処理が得意でクラウドインフラによく使われる。",
    tags: ["Microservices", "Cloud", "CLI Tools"],
    docUrl: "https://go.dev/doc/",
    reviewTips: ["エラーハンドリング（err != nil）の徹底", "Goroutineのリーク防止", "Interfaceの適切な抽象化"],
    frameworks: ["Gin", "Echo", "Gorm"],
    stats: { performance: 5, safety: 4, difficulty: 2 }
  },
  Rust: {
    description: "安全性、速度、並行性を重視したシステムプログラミング言語。ガベージコレクション無しでメモリ安全性を保証する。",
    tags: ["Systems", "WebAssembly", "High Perf"],
    docUrl: "https://www.rust-lang.org/learn",
    reviewTips: ["unwrap()の安易な使用回避", "所有権と借用（Borrowing）の正当性", "Result型によるエラー伝搬"],
    frameworks: ["Yew", "Actix", "Tokio"],
    stats: { performance: 5, safety: 5, difficulty: 5 }
  },
  PHP: {
    description: "Web開発に特化したサーバーサイドスクリプト言語。HTMLに埋め込んで記述できるため初学者にも人気。",
    tags: ["Web Dev", "WordPress", "Server-side"],
    docUrl: "https://www.php.net/docs.php",
    reviewTips: ["型宣言と厳密な型チェック", "SQLインジェクション対策（Prepared Statements）", "XSS対策とエスケープ"],
    frameworks: ["Laravel", "Symfony", "WordPress"],
    stats: { performance: 3, safety: 2, difficulty: 2 }
  },
  Ruby: {
    description: "「開発者の幸福」を重視した、シンプルで表現力豊かなオブジェクト指向スクリプト言語。",
    tags: ["Web Dev (Rails)", "Scripting", "Prototyping"],
    docUrl: "https://www.ruby-lang.org/ja/documentation/",
    reviewTips: ["N+1問題の回避", "メタプログラミングの可読性", "RuboCopによるスタイル統一"],
    frameworks: ["Ruby on Rails", "Sinatra", "Jekyll"],
    stats: { performance: 2, safety: 3, difficulty: 2 }
  },
  'C++': {
    description: "C言語を拡張した、高パフォーマンスな言語。OS、ゲームエンジン、組み込みシステムなどハードウェアに近い制御に使われる。",
    tags: ["Game Engines", "Embedded", "High Perf"],
    docUrl: "https://isocpp.org/",
    reviewTips: ["メモリリークとスマートポインタの使用", "未定義動作（Undefined Behavior）の回避", "コピーコストと参照渡し"],
    frameworks: ["Qt", "Unreal Engine", "Boost"],
    stats: { performance: 5, safety: 2, difficulty: 5 }
  }
}
