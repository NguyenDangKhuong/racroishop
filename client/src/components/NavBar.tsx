import { gql, Reference } from '@apollo/client'
import {
  Box,
  Divider,
  Flex,
  Heading,
  Icon,
  Input,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'
import { AiFillCaretDown, AiOutlineShoppingCart } from 'react-icons/ai'
import { FaFacebook } from 'react-icons/fa'
import { SiZalo } from 'react-icons/si'
import {
  MeDocument,
  MeQuery,
  useLogoutMutation,
  useMeQuery
} from '../generated/graphql'

const Navbar = () => {
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

          cache.modify({
            fields: {
              products(existing) {
                existing.paginatedProducts.forEach((product: Reference) => {
                  cache.writeFragment({
                    id: product.__ref, // `Product:17`
                    fragment: gql`
                      fragment LikeType on Product {
                        likeType
                      }
                    `,
                    data: {
                      likeType: 0
                    }
                  })
                })

                return existing
              }
            }
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
      <Flex>
        <NextLink href='/login'>
          <Link mr={2}>Đăng nhập</Link>
        </NextLink>
        <NextLink href='/register'>
          <Link>Đăng kí</Link>
        </NextLink>
      </Flex>
    )
  } else {
    body = (
      <Popover closeOnBlur trigger='hover'>
        <PopoverTrigger>
          <Flex align='center'>
            <Box>{data?.me?.username}</Box>
            <Icon ml={2} as={AiFillCaretDown}></Icon>
          </Flex>
        </PopoverTrigger>
        <PopoverContent w={200}>
          <Flex flexDirection='column' color='black'>
            <NextLink href='/create-product'>
              <Link
                p={3}
                w={200}
                _hover={{
                  background: 'shopee',
                  color: 'white'
                }}
              >
                Tạo sản phẩm
              </Link>
            </NextLink>
            <Divider />
            <NextLink href=''>
              <Link
                p={3}
                w={200}
                _hover={{
                  background: 'shopee',
                  color: 'white'
                }}
              >
                Lịch sử mua hàng
              </Link>
            </NextLink>
            <Divider />
            <Box
              pointerEvents='auto'
              p={3}
              onClick={logoutUser}
              isLoading={useLogoutMutationLoading}
              w={200}
              _hover={{
                background: 'shopee',
                color: 'white'
              }}
            >
              Đăng xuất
            </Box>
          </Flex>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Box bg='shopee' pb={4}>
      <Flex
        maxW={1200}
        justifyContent='space-between'
        align='center'
        m='auto'
        color='white'
        py={1}
      >
        <Flex align='center'>
          <Box>Kết nối</Box>
          <Icon ml={2} mr={2} as={FaFacebook} bg='shopee'></Icon>
          <Divider orientation='vertical' bg='white' color='white' h={5} />
          <Icon ml={2} fontSize={25} as={SiZalo} bg='shopee'></Icon>
        </Flex>
        {body}
      </Flex>
      <Flex maxW={1200} justifyContent='space-between' align='center' m='auto'>
        <NextLink href='/'>
          <Heading color='white'>Rắc Rối Shop</Heading>
        </NextLink>
        <Box w='60%'>
          <Input bg='white' placeholder='Tìm kiếm sản phẩm' />
        </Box>
        <Popover>
          <PopoverTrigger>
            <Icon
              mr={10}
              as={AiOutlineShoppingCart}
              fontSize={30}
              color='white'
            ></Icon>
          </PopoverTrigger>
          <PopoverContent></PopoverContent>
        </Popover>
      </Flex>
    </Box>
  )
}

export default Navbar
