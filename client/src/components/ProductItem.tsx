import { StarIcon } from '@chakra-ui/icons'
import { Badge, Box, chakra, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import { ProductWithCategoryInfoFragment } from '../generated/graphql'
import ChakraNextImage from './ChakraNextImage'

interface ProductItemProps {
  product: ProductWithCategoryInfoFragment
}

const ProductItem = ({ product }: ProductItemProps) => {
  const property = {
    imageUrl: 'https://bit.ly/2Z4KKcF',
    imageAlt: 'Rear view of modern home with pool',
    beds: 3,
    baths: 2,
    title: 'Modern home in city center in the heart of historic Los Angeles',
    formattedPrice: '$1,900.00',
    reviewCount: 34,
    rating: 4
  }
  return (
    <Box>
      {/* <LikeSection product={product} />
      <Box flex={1}>
        <NextLink href={`/product/${product.id}`}>
          <Link>
            <Heading fontSize='xl'>{product.title}</Heading>
          </Link>
        </NextLink>
        <Text>producted by {product.user.username}</Text>
        <Flex align='center'> */}
      {/* <Text mt={4}>{product.textSnippet}</Text> */}
      {/* <Box ml='auto'>
            <ProductEditDeleteButtons
              productId={product.id}
              productUserId={product.user.id}
            />
          </Box>
        </Flex>
      </Box> */}
      <NextLink href={`/product/${product.id}`}>
        <Link>
          <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
            <ChakraNextImage
              src={property.imageUrl}
              alt={property.imageAlt}
              w='100%'
              h={200}
            />
            <Box p='6'>
              <Box display='flex' alignItems='baseline'>
                <Badge borderRadius='3' px='2' bg='shopee' color='white'>
                  Mới
                </Badge>
                <Box
                  color='gray.500'
                  fontWeight='semibold'
                  letterSpacing='wide'
                  fontSize='xs'
                  textTransform='uppercase'
                  ml='2'
                >
                  {property.beds} beds &bull; {property.baths} baths
                </Box>
              </Box>

              <Box
                mt='1'
                fontWeight='semibold'
                as='h4'
                lineHeight='tight'
                isTruncated
              >
                {property.title}
              </Box>

              <Box>
                {property.formattedPrice}
                <Box as='span' color='gray.600' fontSize='sm'>
                  / wk
                </Box>
              </Box>

              <Box display='flex' mt='2' alignItems='center'>
                {Array(5)
                  .fill('')
                  .map((_, i) => (
                    <StarIcon
                      key={i}
                      color={i < property.rating ? 'yellow.400' : 'gray.300'}
                    />
                  ))}
                <Box as='span' ml='2' color='gray.600' fontSize='sm'>
                  {property.reviewCount} reviews
                </Box>
              </Box>
            </Box>
          </Box>
        </Link>
      </NextLink>
    </Box>
  )
}

export default ProductItem
