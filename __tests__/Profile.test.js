import React from "react";
import { render, fireEvent } from "react-native-testing-library";
import Profile from "../screens/Profile";



describe("Profile Text components", () => {
  it("displays the correct text", () => {
    
    const component = render(<Profile id={1} />);
    expect(component).not.toBeNull();
  

  });
});


