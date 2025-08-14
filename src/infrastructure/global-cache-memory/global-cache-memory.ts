export class GlobalCacheMemory {
	private readonly cache = new Map<string, any>();

	store<T>(key: string, value: T) {
		this.cache.set(key, value);
	}

	get<T>(key: string): T | undefined {
		return this.cache.get(key) as T | undefined;
	}
}
