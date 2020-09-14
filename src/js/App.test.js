/** @format */
import { mount } from "@vue/test-utils";
import App from "./App.vue"; // name of your Vue component

let wrapper;
const mockCallBack = jest.fn();

beforeEach(() => {
	wrapper = mount(App, {
		propsData: {},
		mocks: mockCallBack,
		stubs: {},
		methods: {},
	});
});

afterEach(() => {
	wrapper.destroy();
});

describe("App", () => {
	// Vue renders
	test("is a Vue instance", () => {
		expect(wrapper.isVueInstance).toBeTruthy();
	});

	// Inspect the raw component options
	it("has data", () => {
		expect(typeof App.data).toBe("function");
	});

	// Try to start game without setting up a name
	it("Try to get to the playground without a name", () => {
		return new Promise(done => {
			let trigger = wrapper.find("#trigger");
			trigger.trigger("click").then(() => {
				expect(wrapper.contains("#login")).toBe(true);
				expect(wrapper.contains("#playground")).toBe(false);
				done();
			});
		});
	});

	// Get to the playground using a name
	it("Get to the playground", () => {
		return new Promise(done => {
			let trigger = wrapper.find("#trigger");
			wrapper.find('input[type="text"]').setValue("Matt Damon");
			trigger.trigger("click").then(() => {
				expect(wrapper.contains("#login")).toBe(false);
				expect(wrapper.contains("#playground")).toBe(true);
				done();
			});
		});
	});
});
