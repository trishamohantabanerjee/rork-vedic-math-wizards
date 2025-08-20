import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TEXT_ENCODER = typeof TextEncoder !== 'undefined' ? new TextEncoder() : undefined;
const TEXT_DECODER = typeof TextDecoder !== 'undefined' ? new TextDecoder() : undefined;

const PUBLIC_PASSPHRASE = process.env.EXPO_PUBLIC_CRYPTO_PASSPHRASE ?? 'vmw-default-passphrase-change-me';

function toBase64(bytes: Uint8Array): string {
  let str = '';
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  // eslint-disable-next-line no-undef
  return typeof btoa !== 'undefined' ? btoa(str) : Buffer.from(str, 'binary').toString('base64');
}

function fromBase64(b64: string): Uint8Array {
  // eslint-disable-next-line no-undef
  const bin = typeof atob !== 'undefined' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary');
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function getWebKey() {
  const subtle = (globalThis.crypto && (globalThis.crypto as Crypto).subtle) as SubtleCrypto | undefined;
  if (!subtle || !TEXT_ENCODER) throw new Error('WebCrypto not available');
  const salt = TEXT_ENCODER.encode('vmw-salt');
  const keyMaterial = await subtle.importKey('raw', TEXT_ENCODER.encode(PUBLIC_PASSPHRASE), { name: 'PBKDF2' }, false, ['deriveKey']);
  const key = await subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 310000, hash: 'SHA-256' }, keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  return key;
}

async function webEncrypt(plain: string): Promise<string> {
  const subtle = (globalThis.crypto && (globalThis.crypto as Crypto).subtle) as SubtleCrypto | undefined;
  if (!subtle || !TEXT_ENCODER) throw new Error('WebCrypto not available');
  const key = await getWebKey();
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const enc = await subtle.encrypt({ name: 'AES-GCM', iv }, key, TEXT_ENCODER.encode(plain));
  const out = new Uint8Array(iv.length + (enc as ArrayBuffer).byteLength);
  out.set(iv, 0);
  out.set(new Uint8Array(enc as ArrayBuffer), iv.length);
  return toBase64(out);
}

async function webDecrypt(b64: string): Promise<string | null> {
  const subtle = (globalThis.crypto && (globalThis.crypto as Crypto).subtle) as SubtleCrypto | undefined;
  if (!subtle || !TEXT_DECODER) throw new Error('WebCrypto not available');
  const key = await getWebKey();
  const data = fromBase64(b64);
  const iv = data.slice(0, 12);
  const cipher = data.slice(12);
  try {
    const dec = await subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
    return TEXT_DECODER.decode(dec as ArrayBuffer);
  } catch (e) {
    console.log('[secure-storage] decrypt failed', e);
    return null;
  }
}

function xorBytes(data: Uint8Array, key: Uint8Array): Uint8Array {
  const out = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) out[i] = data[i] ^ key[i % key.length];
  return out;
}

async function nativeEncrypt(plain: string): Promise<string> {
  const enc = TEXT_ENCODER ? TEXT_ENCODER.encode(plain) : new Uint8Array([]);
  const key = TEXT_ENCODER ? TEXT_ENCODER.encode(PUBLIC_PASSPHRASE) : new Uint8Array([]);
  const xored = xorBytes(enc, key);
  return toBase64(xored);
}

async function nativeDecrypt(b64: string): Promise<string | null> {
  const data = fromBase64(b64);
  const key = TEXT_ENCODER ? TEXT_ENCODER.encode(PUBLIC_PASSPHRASE) : new Uint8Array([]);
  const xored = xorBytes(data, key);
  return TEXT_DECODER ? TEXT_DECODER.decode(xored) : null;
}

export const SecureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      const encrypted = Platform.OS === 'web' ? await webEncrypt(value) : await nativeEncrypt(value);
      await AsyncStorage.setItem(key, encrypted);
    } catch (e) {
      console.log('[secure-storage] setItem error', e);
      await AsyncStorage.setItem(key, value);
    }
  },
  async getItem(key: string): Promise<string | null> {
    try {
      const stored = await AsyncStorage.getItem(key);
      if (stored == null) return null;
      const decrypted = Platform.OS === 'web' ? await webDecrypt(stored) : await nativeDecrypt(stored);
      return decrypted ?? stored;
    } catch (e) {
      console.log('[secure-storage] getItem error', e);
      return AsyncStorage.getItem(key);
    }
  },
  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
  async multiRemove(keys: string[]): Promise<void> {
    await AsyncStorage.multiRemove(keys);
  }
};