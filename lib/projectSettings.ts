import { GitHubRepo } from './github';

export interface ProjectVisibility {
  [repoId: string]: boolean;
}

const STORAGE_KEY = 'portfolio_project_visibility';

/**
 * Get project visibility settings from localStorage
 */
export function getProjectVisibility(): ProjectVisibility {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
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
 * Filter visible projects from the list
 */
export function filterVisibleProjects(projects: GitHubRepo[]): GitHubRepo[] {
  const visibility = getProjectVisibility();
  return projects.filter(project => {
    const id = String(project.id);
    // Default to visible if not set
    return visibility[id] !== false;
  });
}
