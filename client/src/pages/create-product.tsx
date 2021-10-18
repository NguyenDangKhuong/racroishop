import { useCheckAuth } from '../utils/useCheckAuth'
import {
  Flex,
  Spinner,
  Box,
  Button,
  Wrap,
  WrapItem,
  Center,
  Image,
  Icon
} from '@chakra-ui/react'
import Layout from '../components/Layout'
import { Formik, Form } from 'formik'
import InputField from '../components/InputField'
import NextLink from 'next/link'
import {
  CreateProductInput,
  useCategoriesQuery,
  useCreateProductMutation
} from '../generated/graphql'
import router from 'next/router'
import { useUploadImage, useDeleteImage } from '../utils/useUploadImage'
import { MdCancel } from 'react-icons/md'

const CreateProduct = () => {
  const { data: authData, loading: authLoading } = useCheckAuth()
  const {
    uploadImageUrls,
    renderInputUpload,
    setUploadImageUrls
  } = useUploadImage()

  const { data: categoriesData } = useCategoriesQuery()

  const initialValues = { title: '', description: '', price: 0, categoryId: 0 }
  const [createProduct, _] = useCreateProductMutation()

  const onCreateProductSubmit = async (values: CreateProductInput) => {
    await createProduct({
      variables: {
        createProductInput: {
          ...values,
          categoryId: Number(values.categoryId)
        }
      },
      update(cache, { data }) {
        cache.modify({
          fields: {
            products(existing) {
              if (data?.createProduct.success && data.createProduct.product) {
                // trả ra Product:new_id, ref product mới vừa tạo xong
                const newProductRef = cache.identify(data.createProduct.product)

                //ghi đè lên cache để hiển thị lại list product mới tạo lên đầu, các cái còn lại xuống dưới
                const newProductsAfterCreation = {
                  ...existing,
                  totalCount: existing.totalCount + 1,
                  paginatedProducts: [
                    { __ref: newProductRef },
                    ...existing.paginatedProducts // [{__ref: 'Product:1'}, {__ref: 'Product:2'}]
                  ]
                }

                return newProductsAfterCreation
              }
            }
          }
        })
      }
    })
    router.push('/')
  }

  //đang loading rồi hoặc đã loading và không có login
  if (authLoading || (!authLoading && !authData?.me)) {
    return (
      <Flex justifyContent='center' alignItems='center' minH='100vh'>
        <Spinner />
      </Flex>
    )
  } else {
    return (
      <Layout>
        <Formik initialValues={initialValues} onSubmit={onCreateProductSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name='title'
                placeholder='Tên sản phẩm'
                label='Tên sản phẩm'
                type='text'
              />

              <Box mt={4}>
                <InputField
                  name='description'
                  placeholder='Mô tả'
                  label='Mô tả'
                  type='textarea'
                />
              </Box>
              <Box mt={4}>
                <InputField
                  name='price'
                  placeholder='Giá'
                  label='Giá'
                  type='number'
                />
              </Box>
              <Box mt={4}>
                <InputField
                  name='categoryId'
                  placeholder='Danh mục sản phẩm'
                  label='Danh mục sản phẩm'
                  type='select'
                  selectoption={categoriesData?.categories?.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                />
              </Box>
              <Box mt={4}>{renderInputUpload}</Box>
              {uploadImageUrls && (
                <Wrap mt='5'>
                  {uploadImageUrls.map(({ url, public_id }, index) => (
                    <WrapItem key={index}>
                      <Center
                        w='200px'
                        h='300px'
                        bg='#e7e7e7'
                        position='relative'
                      >
                        <Image src={url}></Image>
                        <Icon
                          position='absolute'
                          top='1'
                          right='1'
                          fontSize='30'
                          cursor='pointer'
                          as={MdCancel}
                          onClick={() => {
                            useDeleteImage(public_id)
                            setUploadImageUrls(
                              uploadImageUrls.filter(
                                (item: any) => item.public_id !== public_id
                              )
                            )
                          }}
                        ></Icon>
                      </Center>
                    </WrapItem>
                  ))}
                </Wrap>
              )}
              <Flex justifyContent='space-between' alignItems='center' mt={4}>
                <Button
                  type='submit'
                  colorScheme='teal'
                  isLoading={isSubmitting}
                >
                  Thêm sản phẩm mới
                </Button>
                <NextLink href='/'>
                  <Button>Trở lại trang chủ</Button>
                </NextLink>
              </Flex>
            </Form>
          )}
        </Formik>
      </Layout>
    )
  }
}

export default CreateProduct
