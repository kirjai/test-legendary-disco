import type { Cache } from "./cache.interface";

export class GlobalCacheMemory implements Cache {
	private readonly cache = new Map<string, any>();

	set<T>(key: string, value: T) {
		this.cache.set(key, value);
	}

	get<T>(key: string): T | undefined {
		return this.cache.get(key) as T | undefined;
	}
}
