export default interface ICacheProvider {
  save(key: string, value: any, option?: string, time?: number): Promise<void>;
  recover<T>(key: string): Promise<T | undefined>;
  invalidate(key: string): Promise<void>;
  invalidatePrefix(prefix: string): Promise<void>;
}
