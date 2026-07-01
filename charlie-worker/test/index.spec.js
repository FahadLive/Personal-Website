import {
	env,
	createExecutionContext,
	waitOnExecutionContext,
	SELF,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src";

describe("charlie-worker", () => {
	it("replies ok to GET requests", async () => {
		const request = new Request("http://example.com");
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(await response.text()).toBe("ok");
	});

	it("replies ok to integration GET", async () => {
		const response = await SELF.fetch("http://example.com");
		expect(await response.text()).toBe("ok");
	});
});
