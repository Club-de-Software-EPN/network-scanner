import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const TitleBar = (): JSX.Element => {
  return (
    <Box
      minH="30px"
      maxH="30px"
      w="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      css={{
        '-webkit-user-select': 'none',
        '-webkit-app-region' : 'drag',
      }}
    >
      {/* <Text fontSize="sm">Network Scanner</Text> */}
    </Box>
  );
};

export default TitleBar;
