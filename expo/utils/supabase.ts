import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { SecureStorage } from '@/utils/secure-storage';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!url || !anonKey) {
  console.log('[supabase] Missing env. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY');
}

const storageKey = 'supabase.auth.token';

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key: string) => SecureStorage.getItem(key === 'supabase.auth.token' ? storageKey : key),
      setItem: (key: string, value: string) => SecureStorage.setItem(key === 'supabase.auth.token' ? storageKey : key, value),
      removeItem: (key: string) => SecureStorage.removeItem(key === 'supabase.auth.token' ? storageKey : key),
    },
  },
});

export async function checkSupabaseConnectivity(): Promise<boolean> {
  try {
    const { error } = await supabase.from('_').select('count').limit(1);
    if (error) console.log('[supabase] connectivity check note:', error.message);
    return true;
  } catch (e) {
    console.log('[supabase] connectivity failed', e);
    return false;
  }
}