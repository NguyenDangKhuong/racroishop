import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import NavBar from '../components/NavBar'
import { ProductsDocument, useProductsQuery } from '../generated/graphql'
import { addApolloState, initializeApollo } from '../lib/apolloClient'

export const limit = 3

const Index = () => {
  const { data, loading } = useProductsQuery()
  return (
    <>
      <NavBar />
      {loading ? (
        '...LOADING'
      ) : (
        <ul>
          {data?.products?.map((product) => (
            <li>{product.title}</li>
          ))}
        </ul>
      )}
    </>
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
