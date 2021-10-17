import { NetworkStatus } from '@apollo/client'
import { Button, Flex, Grid, Spinner } from '@chakra-ui/react'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Layout from '../components/Layout'
import ProductItem from '../components/ProductItem'
import { ProductsDocument, useProductsQuery } from '../generated/graphql'
import { addApolloState, initializeApollo } from '../lib/apolloClient'

export const limit = 3

const Index = () => {
  const { data, loading, fetchMore, networkStatus } = useProductsQuery({
    variables: { limit },

    // component nao render boi cai Products query, se rerender khi networkStatus thay doi, tuc la fetchMore
    notifyOnNetworkStatusChange: true
  })

  const loadingMoreProducts = networkStatus === NetworkStatus.fetchMore

  const loadMoreProducts = () =>
    fetchMore({ variables: { cursor: data?.products?.cursor } })

  return (
    <Layout>
      {loading && !loadingMoreProducts ? (
        <Flex justifyContent='center' alignItems='center' minH='100vh'>
          <Spinner />
        </Flex>
      ) : (
        <Grid templateColumns='repeat(3, 1fr)' gap={6}>
          {data?.products?.paginatedProducts.map(product => (
            <ProductItem key={product.id} product={product} />
          ))}
        </Grid>
      )}

      {data?.products?.hasMore && (
        <Flex>
          <Button
            m='auto'
            my={8}
            isLoading={loadingMoreProducts}
            onClick={loadMoreProducts}
          >
            {loadingMoreProducts ? 'Đang tải' : 'Xem thêm'}
          </Button>
        </Flex>
      )}
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
