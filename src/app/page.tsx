'use client'

import { Box, Button, Heading } from '@chakra-ui/react'

export default function Home() {
  return (
    <Box textAlign="center" mt={10}>
      <Heading>Welcome to Chakra UI in Next.js!</Heading>
      <Button colorScheme="teal" mt={4}>
        Click Me
      </Button>
    </Box>
  )
}
