import { extendTheme } from "@chakra-ui/react";

const CustomTheme = extendTheme({
  styles: {
    global: {
      "body, html, *": {
        color: '#5C0F8B',
        backgroundColor: '#F6F8FA',
        margin: 0,
        padding: 0,
        '-webkit-touch-callout': 'none',
        '-webkit-user-select': 'none',
        '-khtml-user-select': 'none',
        '-moz-user-select': 'none',
        '-ms-user-select': 'none',
        'user-select': 'none',
      },
      body: {
        width: '100%',
      }
    }
  }
});

export default CustomTheme;
