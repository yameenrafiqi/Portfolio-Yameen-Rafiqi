import { GitHubRepo } from './github';

export interface ProjectVisibility {
  [repoId: string]: boolean;
}

const STORAGE_KEY = 'portfolio_project_visibility';

function normalizeVisibility(value: unknown): ProjectVisibility {
  if (!value || typeof value !== 'object') {
    return {};
  }

  if (value instanceof Map) {
    return Object.fromEntries(value.entries()) as ProjectVisibility;
  }

  return Object.entries(value as Record<string, unknown>).reduce<ProjectVisibility>((acc, [key, entryValue]) => {
    if (typeof entryValue === 'boolean') {
      acc[key] = entryValue;
    }
    return acc;
  }, {});
}

/**
 * Get project visibility settings from localStorage
 */
export function getProjectVisibility(): ProjectVisibility {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return normalizeVisibility(stored ? JSON.parse(stored) : {});
  } catch (error) {
    console.error('Error reading project visibility:', error);
    return {};
  }
}

/**
 * Save project visibility settings to localStorage
 */
export function saveProjectVisibility(visibility: ProjectVisibility): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visibility));
  } catch (error) {
    console.error('Error saving project visibility:', error);
  }
}

/**
 * Ensure newly discovered GitHub repos default to visible while preserving existing choices.
 */
export function mergeProjectVisibility(visibility: ProjectVisibility, repos: GitHubRepo[]): ProjectVisibility {
  const nextVisibility: ProjectVisibility = { ...visibility };

  repos.forEach((repo) => {
    const id = String(repo.id);
    if (!(id in nextVisibility)) {
      nextVisibility[id] = true;
    }
  });

  return nextVisibility;
}

/**
 * Filter visible projects from the list
 */
export function filterVisibleProjects(projects: GitHubRepo[]): GitHubRepo[] {
  const visibility = getProjectVisibility();
  return projects.filter((project) => {
    const id = String(project.id);
    // Default to visible if not set
    return visibility[id] !== false;
  });
}
