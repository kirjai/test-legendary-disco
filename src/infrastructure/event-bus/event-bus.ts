import type { DomainEvent } from "@/domains/shared/events/domain-events";

export class EventBus {
	private readonly subscribers = new Map<
		string,
		Set<(event: DomainEvent) => void>
	>();

	publish<T extends DomainEvent>(event: T) {
		const handlers = this.subscribers.get(event._tag) ?? new Set();
		handlers.forEach((handler) => handler(event));
	}

	subscribe<T extends DomainEvent["_tag"]>(
		eventTag: T,
		handler: (event: Extract<DomainEvent, { _tag: T }>) => void,
	) {
		const handlers = this.subscribers.get(eventTag) ?? new Set();

		// SAFE CAST: We store the handler with a compatible signature.
		// At runtime, we only call handlers for events with matching tags,
		// so Extract<DomainEvent, { _tag: T }> will always be the correct type.
		const compatibleHandler = handler as (event: DomainEvent) => void;

		handlers.add(compatibleHandler);
		this.subscribers.set(eventTag, handlers);

		return {
			unsubscribe: () => {
				const handlers = this.subscribers.get(eventTag);
				if (handlers) {
					handlers.delete(compatibleHandler);
				}
			},
		};
	}
}
