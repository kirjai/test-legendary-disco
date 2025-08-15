import { expect, test, describe, vi } from "vitest";
import { EventBus } from "./event-bus";
import { mockAnalyticsReportEvent } from "@/domains/shared/events/mocks/domain-events.mock";

describe("EventBus", () => {
	test("should publish event to subscribers", () => {
		const instance = new EventBus();
		const handler = vi.fn();
		const event = mockAnalyticsReportEvent;

		instance.subscribe(mockAnalyticsReportEvent._tag, handler);
		instance.publish(event);

		expect(handler).toHaveBeenCalledWith(event);
	});

	test("should unsubscribe from event", () => {
		const instance = new EventBus();
		const handler = vi.fn();
		const event = mockAnalyticsReportEvent;

		const handlerInstance = instance.subscribe(
			mockAnalyticsReportEvent._tag,
			handler,
		);
		handlerInstance.unsubscribe();
		instance.publish(event);

		expect(handler).not.toHaveBeenCalled();
	});
});
