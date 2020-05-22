import React from "react";
import { render, fireEvent } from "react-native-testing-library";
import OfflineNotice from "../components/OfflineNotice";

describe("OfflineNotice Text components", () => {
  it("displays the correct text", () => {
    const { queryByText } = render(<OfflineNotice />);
    expect(queryByText("No Internet Connection")).toBeNull();
  });
});
