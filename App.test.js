// @noflow
import React from "react";
import renderer from "react-test-renderer";

import {AppNavigator} from "./App";

// eslint-disable-next-line
it("renders without crashing", () => {
    const rendered = renderer.create(<AppNavigator />).toJSON();
    // eslint-disable-next-line
    expect(rendered).toBeTruthy();
});
