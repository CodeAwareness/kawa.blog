export const languages = {
  en: 'English',
  ja: '日本語',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'en';

// UI strings keyed by language. Add a key here and to every language below.
export const ui = {
  en: {
    'site.title': 'Kawa Code Blog',
    'site.tagline': 'Decision Genomics for AI engineering',
    'nav.blog': 'Blog',
    'nav.home': 'Home',
    'home.heading': 'The Kawa Code Blog',
    'home.intro':
      'Notes on AI Decision Management — capturing the reasoning behind code so your AI agents work with the full picture.',
    'home.latest': 'Latest posts',
    'post.publishedOn': 'Published',
    'post.updatedOn': 'Updated',
    'post.backToBlog': '← Back to all posts',
    'post.readingTime': 'min read',
    'blog.heading': 'All posts',
    'footer.rights': 'All rights reserved.',
    'lang.switchTo': 'Read in 日本語',
    'related.heading': 'Related posts',
  },
  ja: {
    'site.title': 'Kawa Code ブログ',
    'site.tagline': 'AIエンジニアリングのためのDecision Genomics',
    'nav.blog': 'ブログ',
    'nav.home': 'ホーム',
    'home.heading': 'Kawa Code ブログ',
    'home.intro':
      'AIによる意思決定管理についての記録 — コードの背後にある理由を記録し、AIエージェントが全体像を踏まえて作業できるようにします。',
    'home.latest': '最新の記事',
    'post.publishedOn': '公開日',
    'post.updatedOn': '更新日',
    'post.backToBlog': '← 記事一覧へ戻る',
    'post.readingTime': '分で読めます',
    'blog.heading': 'すべての記事',
    'footer.rights': 'All rights reserved.',
    'lang.switchTo': 'Read in English',
    'related.heading': '関連記事',
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];
