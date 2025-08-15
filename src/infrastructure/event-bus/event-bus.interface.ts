import type { DomainEvent } from "@/domains/shared/events/domain-events";

export interface EventBus {
	publish<T extends DomainEvent>(event: T): void;
	subscribe<T extends DomainEvent["_tag"]>(
		eventTag: T,
		handler: (event: Extract<DomainEvent, { _tag: T }>) => void,
	): { unsubscribe: () => void };
}
