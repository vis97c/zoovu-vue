/** @format */
import { shallowMount } from "@vue/test-utils";
import Component from "./App.vue"; // name of your Vue component

let wrapper;

beforeEach(() => {
	wrapper = shallowMount(Component, {
		propsData: {},
		mocks: {},
		stubs: {},
		methods: {},
	});
});

afterEach(() => {
	wrapper.destroy();
});

describe("Component", () => {
	test("is a Vue instance", () => {
		expect(wrapper.isVueInstance).toBeTruthy();
	});
});
