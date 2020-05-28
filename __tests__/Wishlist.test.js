import React from "react";
import { render, fireEvent } from "react-native-testing-library";
import Wishlist from "../screens/Wishlist";



describe("Wishlist Text components", () => {
  it("displays the correct text", () => {
    
    const component = render(<Wishlist id={1} />);
    expect(component).not.toBeNull();
  

  });
});


