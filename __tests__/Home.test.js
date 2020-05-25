import React from "react";
import { render, fireEvent } from "react-native-testing-library";
import Home from "../screens/Home";

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

describe("Home Text components", () => {
  it("displays the correct text", () => {
    
    const component = render(<Home />);
    expect(component.queryByText("Filter")).not.toBeNull();
  

    //fireEvent.changeText(component.getByTestId("searchCity"), "Aveiro");
  });
});

describe("Home function handling", () => {
  it("Call search function", () => {
    const component = render(<Home />);

    fireEvent.changeText(
      component.getByTestId("citySearch"),
      "Aveiro"
    );
    const touchableEl = component.getByTestId("citySearchButton");

    touchableEl.props.onPress();
  });
});
