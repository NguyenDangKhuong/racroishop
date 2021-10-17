import { Box, BoxProps } from '@chakra-ui/react'
import * as React from 'react'
import NextImage from 'next/image'

const ChakraNextImage = ({
  src,
  alt,
  ...rest
}: { src: string; alt: string } & Omit<BoxProps, 'as'>) => {
  return (
    <Box position='relative' {...rest}>
      <NextImage objectFit='cover' layout='fill' src={src} alt={alt} />
    </Box>
  )
}
export default ChakraNextImage
