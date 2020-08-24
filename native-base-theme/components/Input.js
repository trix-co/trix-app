import { Platform } from 'react-native';

import variable from './../variables/platform';

export default (variables = variable) => {
  const inputTheme = {
    height: variables.inputHeightBase,
    color: variables.inputColor,
    paddingLeft: 0,
    paddingRight: 0,
    flex: 1,
    fontSize: variables.inputFontSize,
    lineHeight: variables.inputLineHeight,
  };


  return inputTheme;
};
