export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  created_at: string;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

const GITHUB_USERNAME = 'yameenrafiqi';
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

/**
 * Fetch user's public repositories from GitHub with optimized caching
 */
export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    };

    // Add authentication if token is available (increases rate limit)
    if (GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }

    const response = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=50`,
      {
        headers,
        // Aggressive caching for production performance
        next: {
          revalidate: 3600, // Revalidate every 1 hour
          tags: ['github-repos'],
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos: GitHubRepo[] = await response.json();
    
    // Filter out forks and sort by stars and update date
    return repos
      .filter((repo) => !repo.full_name.includes('/') || repo.full_name.startsWith(GITHUB_USERNAME))
      .sort((a, b) => {
        // Sort by stars first, then by update date
        if (b.stargazers_count !== a.stargazers_count) {
          return b.stargazers_count - a.stargazers_count;
        }
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return [];
  }
}

/**
 * Fetch user profile information from GitHub with optimized caching
 */
export async function fetchGitHubUser(): Promise<GitHubUser | null> {
  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    };

    // Add authentication if token is available
    if (GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }

    const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`, {
      headers,
      // Cache for 24 hours - user data changes infrequently
      next: {
        revalidate: 86400,
        tags: ['github-user'],
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    return null;
  }
}

/**
 * Get repository statistics
 */
export function getRepoStats(repos: GitHubRepo[]) {
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
  const languages = new Set(repos.map((repo) => repo.language).filter(Boolean));

  return {
    totalRepos: repos.length,
    totalStars,
    totalForks,
    languages: Array.from(languages),
  };
}

/**
 * Categorize repository based on language and topics
 */
export function categorizeRepo(repo: GitHubRepo): string {
  const language = repo.language?.toLowerCase() || '';
  const topics = repo.topics.join(' ').toLowerCase();
  const name = repo.name.toLowerCase();
  const description = (repo.description || '').toLowerCase();

  // Check for specific categories
  if (
    topics.includes('security') ||
    name.includes('security') ||
    description.includes('security') ||
    name.includes('hack')
  ) {
    return 'Security';
  }

  if (
    topics.includes('automation') ||
    topics.includes('bot') ||
    name.includes('automation') ||
    description.includes('automation')
  ) {
    return 'Automation';
  }

  if (
    topics.includes('ai') ||
    topics.includes('ml') ||
    topics.includes('machine-learning') ||
    description.includes('ai') ||
    description.includes('machine learning')
  ) {
    return 'AI';
  }

  if (
    language === 'javascript' ||
    language === 'typescript' ||
    language === 'html' ||
    language === 'css' ||
    topics.includes('web') ||
    topics.includes('react') ||
    topics.includes('nextjs')
  ) {
    return 'Web';
  }

  if (language === 'python') {
    return 'Python';
  }

  if (language === 'c' || language === 'c++' || language === 'java') {
    return 'Systems';
  }

  return 'Other';
}

/**
 * Get language color for badge display
 */
export function getLanguageColor(language: string | null): string {
  const colors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    HTML: '#e34c26',
    CSS: '#563d7c',
    C: '#555555',
    'C++': '#f34b7d',
    Java: '#b07219',
    Go: '#00ADD8',
    Rust: '#dea584',
    PHP: '#4F5D95',
  };

  return colors[language || ''] || '#00FF94';
}

/**
 * Get project-specific image or fallback to default
 */
export function getProjectImage(repoName: string, language: string | null): string {
  // Normalize the repo name: lowercase and remove spaces/hyphens/underscores
  const normalizedName = repoName.toLowerCase().replace(/[\s\-_]/g, '');
  
  // Map of specific project images (add your custom images here)
  const projectImages: Record<string, string> = {
    // Portfolio
    'portfolioyameenrafiqi': '/portfolio.png',
    'portfolio': '/portfolio.png',
    
    // RawSpill
    'realrawspill': '/rawspill.png',
    'rawspill': '/rawspill.png',
    'rawspillunfilteredthoughts': '/rawspill.png',
    
    // ahaPhysics
    'ahaphysics': '/ahaphysics.png',
    
    // Mosque Management System
    'mosquemanagementsystem': '/masjid.png',
    'masjid': '/masjid.png',
  };

  // Check for custom image first
  const customImage = projectImages[normalizedName];
  if (customImage) {
    return customImage;
  }

  // Fallback images based on category/language
  const fallbackImages: Record<string, string> = {
    JavaScript: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600',
    TypeScript: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600',
    Python: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600',
    HTML: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600',
    C: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600',
    'C++': 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600',
  };

  return fallbackImages[language || ''] || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600';
}

/**
 * Get live URL for a project
 */
export function getProjectLiveUrl(repoName: string): string | null {
  // Normalize the repo name: lowercase and remove spaces/hyphens/underscores
  constPortfolio
    'portfolioyameenrafiqi': 'https://portfolio-yameen-rafiqi.vercel.app/',
    'portfolio': 'https://portfolio-yameen-rafiqi.vercel.app/',
    
    //  normalizedName = repoName.toLowerCase().replace(/[\s\-_]/g, '');
  
  // Map of normalized project names to their live URLs
  const liveUrls: Record<string, string> = {
    // Mosque Management System
    'mosquemanagementsystem': 'https://masjid-al-taqwa-lolab.netlify.app/',
    'masjid': 'https://masjid-al-taqwa-lolab.netlify.app/',
    
    // RawSpill
    'realrawspill': 'https://rawspill.com/',
    'rawspill': 'https://rawspill.com/',
    'rawspillunfilteredthoughts': 'https://rawspill.com/',
    
    // ahaPhysics
    'ahaphysics': 'https://ahaphysics.netlify.app/',
  };

  return liveUrls[normalizedName] || null;
}
