import { GitHubRepo } from './github';

export interface ProjectVisibility {
  [repoId: string]: boolean;
}

const STORAGE_KEY = 'portfolio_project_visibility';
const ADMIN_PASSWORD_KEY = 'portfolio_admin_password';
const DEFAULT_PASSWORD = 'yameen@2026'; // Change this to your preferred password

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
 * Toggle project visibility
 */
export function toggleProjectVisibility(repoId: string | number): void {
  const visibility = getProjectVisibility();
  const id = String(repoId);
  visibility[id] = !visibility[id];
  saveProjectVisibility(visibility);
}

/**
 * Check if a project is visible
 */
export function isProjectVisible(repoId: string | number): boolean {
  const visibility = getProjectVisibility();
  const id = String(repoId);
  // Default to visible if not set
  return visibility[id] !== false;
}

/**
 * Filter visible projects
 */
export function filterVisibleProjects(projects: GitHubRepo[]): GitHubRepo[] {
  const visibility = getProjectVisibility();
  return projects.filter(project => {
    const id = String(project.id);
    // Default to visible if not set
    return visibility[id] !== false;
  });
}

/**
 * Set admin password
 */
export function setAdminPassword(password: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Simple hash (for demo - use proper auth in production)
    const hashed = btoa(password);
    localStorage.setItem(ADMIN_PASSWORD_KEY, hashed);
  } catch (error) {
    console.error('Error setting admin password:', error);
  }
}

/**
 * Verify admin password
 */
export function verifyAdminPassword(password: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const stored = localStorage.getItem(ADMIN_PASSWORD_KEY);
    const hashed = btoa(password);
    
    // If no password is set, use default
    if (!stored) {
      return password === DEFAULT_PASSWORD;
    }
    
    return stored === hashed;
  } catch (error) {
    console.error('Error verifying admin password:', error);
    return false;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const auth = sessionStorage.getItem('portfolio_admin_auth');
    return auth === 'true';
  } catch (error) {
    return false;
  }
}

/**
 * Set authentication status
 */
export function setAuthenticated(value: boolean): void {
  if (typeof window === 'undefined') return;
  
  try {
    if (value) {
      sessionStorage.setItem('portfolio_admin_auth', 'true');
    } else {
      sessionStorage.removeItem('portfolio_admin_auth');
    }
  } catch (error) {
    console.error('Error setting authentication:', error);
  }
}

/**
 * Logout
 */
export function logout(): void {
  setAuthenticated(false);
}
