import NextLink from 'next/link'
import { Box, Heading, Flex, Link, Button } from '@chakra-ui/react'
import {
  MeDocument,
  MeQuery,
  useLogoutMutation,
  useMeQuery
} from '../generated/graphql'
const NavBar = () => {
  const { data, loading: useMeQueryLoading } = useMeQuery()
  const [logout, { loading: useLogoutMutationLoading }] = useLogoutMutation()

  const logoutUser = async () => {
    await logout({
      update(cache, { data }) {
        if (data?.logout) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: { me: null }
          })
        }
      }
    })
  }

  let body

  if (useMeQueryLoading) {
    body = null
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href='/login'>
          <Link mr={2}>Đăng nhập</Link>
        </NextLink>
        <NextLink href='/register'>
          <Link mr={2}>Đăng kí</Link>
        </NextLink>
      </>
    )
  } else {
    body = (
      <Button onClick={logoutUser} isLoading={useLogoutMutationLoading}>
        Đăng xuất
      </Button>
    )
  }

  return (
    <Box bg='tan' p={4}>
      <Flex maxW={800} justifyContent='space-between' align='center' m='auto'>
        <NextLink href='/'>
          <Heading>RacRoiShop</Heading>
        </NextLink>
        <Box>{body}</Box>
      </Flex>
    </Box>
  )
}

export default NavBar
