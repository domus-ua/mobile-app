import React from "react";
import { render, fireEvent } from "react-native-testing-library";
import HouseItem from "../components/HouseItemWishlist";

describe("HouseItem Text components", () => {
  it("displays the correct text", () => {
    const { queryByText } = render(
      <HouseItem
        id={1}
        locatarioId={5}
        photo={"http://192.168.160.60:3000/static/media/home.200c1988.jpg"}
        name={"Casa c/ 2 quartos"}
        price={"250"}
        rooms={2}
        bathrooms={2}
        area={500}
        city={"Aveiro"}
        rating={0}
        favorite={true}
      />
    );
    expect(queryByText("2 Bedroom")).not.toBeNull();
    expect(queryByText("2 Bathroom")).not.toBeNull();
    expect(queryByText("Aveiro")).not.toBeNull();
    expect(queryByText("500 m2")).not.toBeNull();
    expect(queryByText("Casa c/ 2 quartos")).not.toBeNull();
  });
});

describe("Houseitem function handling", () => {
  it("Call redirect function", () => {
    const component = render(
      <HouseItem
        id={1}
        locatarioId={5}
        photo={"http://192.168.160.60:3000/static/media/home.200c1988.jpg"}
        name={"Casa c/ 2 quartos"}
        price={"250"}
        rooms={2}
        bathrooms={2}
        area={500}
        city={"Aveiro"}
        rating={0}
        favorite={true}
      />
    );

    expect(component.getByTestId("redirect")).not.toBeNull();
  });
});
