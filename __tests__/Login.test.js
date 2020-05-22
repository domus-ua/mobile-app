import React from "react";
import { render, fireEvent } from "react-native-testing-library";
import Login from "../screens/Login";
describe("Login Text components", () => {
  it("displays the correct text", () => {
    const { queryByText, getByTestId } = render(<Login />);
    expect(queryByText("Ignore this step")).not.toBeNull();
    expect(getByTestId("titleText")).not.toBeNull();
    expect(getByTestId("buttonText")).not.toBeNull();
  });
});

describe("Login function handling", () => {
  it("Call login function", () => {
    const component = render(<Login />);

    fireEvent.changeText(
      component.getByTestId("username"),
      "locador2@mail.com"
    );
    fireEvent.changeText(component.getByTestId("password"), "");
    const touchableEl = component.getByTestId("signInButton");

    touchableEl.props.onPress();
  });
});
