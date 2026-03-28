type GradientTuple = readonly [string, string];

export const colors = {
  primary: '#59CE72',
  secondary: '#0EA5E9',
  accent: '#59CE72',
  success: '#59CE72',
  warning: '#F59E0B',
  error: '#EF4444',
  
  background: '#0B1B2B',
  surface: '#10243A',
  
  text: {
    primary: '#E5E7EB',
    secondary: '#94A3B8',
    light: '#CBD5E1',
  },
  
  gradients: {
    primary: ['#59CE72', '#3FB25C'] as GradientTuple,
    secondary: ['#0EA5E9', '#22D3EE'] as GradientTuple,
    success: ['#59CE72', '#3FB25C'] as GradientTuple,
    warm: ['#F59E0B', '#F97316'] as GradientTuple,
    navy: ['#0B1B2B', '#10243A'] as GradientTuple,
    softBlue: ['#0B1B2B', '#10243A'] as GradientTuple,
  } as Record<string, GradientTuple>,
  
  wizard: {
    hat: '#1D4ED8',
    robe: '#1E40AF',
    star: '#F59E0B',
  }
};