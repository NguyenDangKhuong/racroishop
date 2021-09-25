import {
  Box,
  Flex,
  Heading,
  Link,
  Spinner,
  Stack,
  Text
} from '@chakra-ui/react'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import NextLink from 'next/link'
import Layout from '../components/Layout'
import ProductEditDeleteButtons from '../components/ProductEditDeleteButtons'
import { ProductsDocument, useProductsQuery } from '../generated/graphql'
import { addApolloState, initializeApollo } from '../lib/apolloClient'

export const limit = 3

const Index = () => {
  const { data, loading } = useProductsQuery()
  return (
    <Layout>
      {loading ? (
        // && !loadingMoreproducts
        <Flex justifyContent='center' alignItems='center' minH='100vh'>
          <Spinner />
        </Flex>
      ) : (
        <Stack spacing={8}>
          {data?.products?.map(product => (
            <Flex key={product.id} p={5} shadow='md' borderWidth='1px'>
              {/* <UpvoteSection product={product} /> */}
              <Box flex={1}>
                <NextLink href={`/product/${product.id}`}>
                  <Link>
                    <Heading fontSize='xl'>{product.title}</Heading>
                  </Link>
                </NextLink>
                <Text>producted by {product.category.title}</Text>
                <Flex align='center'>
                  <Text mt={4}>{product.description}</Text>
                  <Box ml='auto'>
                    <ProductEditDeleteButtons
                      productId={product.id}
                      // productUserId={product.user.id}
                    />
                  </Box>
                </Flex>
              </Box>
            </Flex>
          ))}
        </Stack>
      )}

      {/* {data?.products?.hasMore && (
        <Flex>
          <Button
            m='auto'
            my={8}
            isLoading={loadingMoreproducts}
            onClick={loadMoreproducts}
          >
            {loadingMoreproducts ? 'Loading' : 'Show more'}
          </Button>
        </Flex>
      )} */}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const apolloClient = initializeApollo({ headers: context.req.headers })

  await apolloClient.query({
    query: ProductsDocument,
    variables: {
      limit
    }
  })

  return addApolloState(apolloClient, {
    props: {}
  })
}

export default Index
