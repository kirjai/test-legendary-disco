import { expect, test, describe, vi } from "vitest";
import { NetworkManagerService } from "./network-manager.service";
import { InvalidJSONError, NetworkError } from "./network-manager.interface";

describe("NetworkManager", () => {
	test("should fetch the given request", () => {
		const mockFetch = vi.fn().mockResolvedValue({});
		const instance = new NetworkManagerService(mockFetch);
		const request = new Request("https://example.com");

		instance.requestJSON(request, {
			onSuccess: vi.fn(),
			onError: vi.fn(),
		});

		expect(mockFetch).toHaveBeenCalledWith(request);
	});

	test("should invoke the callback with parsed JSON", async () => {
		const instance = new NetworkManagerService(
			vi
				.fn()
				.mockResolvedValue(new Response(JSON.stringify({ hello: "world" }))),
		);
		const onSuccess = vi.fn();

		await instance.requestJSON(new Request("https://example.com"), {
			onSuccess,
			onError: vi.fn(),
		});

		expect(onSuccess).toHaveBeenCalledWith({ hello: "world" });
	});

	test("should invoke the callback with an error if the response is not ok", async () => {
		const response = new Response("Not found", { status: 404 });
		const instance = new NetworkManagerService(
			vi.fn().mockResolvedValue(response),
		);
		const onError = vi.fn();

		await instance.requestJSON(new Request("https://example.com"), {
			onSuccess: vi.fn(),
			onError,
		});

		expect(onError).toHaveBeenCalledWith(
			new NetworkError(
				"Network response was not ok",
				{ cause: response },
				new Request("https://example.com"),
				response,
			),
		);
	});

	test("should invoke the callback with an error if the response is not JSON", async () => {
		const request = new Request("https://example.com");
		const response = new Response("Not JSON", { status: 200 });
		const instance = new NetworkManagerService(
			vi.fn().mockResolvedValue(response),
		);
		const onError = vi.fn();

		await instance.requestJSON(request, {
			onSuccess: vi.fn(),
			onError,
		});

		expect(onError).toHaveBeenCalledWith(expect.any(InvalidJSONError));
	});
});
