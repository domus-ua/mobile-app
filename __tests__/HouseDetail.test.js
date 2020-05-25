import React from "react";
import { render, fireEvent } from "react-native-testing-library";
import HouseDetail from "../screens/HouseDetail";



describe("Home Text components", () => {
  it("displays the correct text", () => {
    
    const component = render(<HouseDetail id={1} />);
    expect(component).not.toBeNull();
  

  });
});


