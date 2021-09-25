import {
  Arg,
  FieldResolver,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware
} from 'type-graphql'
import { LessThan } from 'typeorm'
import { Category } from '../entities/Category'
import { Product } from '../entities/Product'
import { checkAuth } from '../middleware/checkAuth'
import { CreateProductInput } from '../types/products/CreateProductInput'
import { PaginatedProducts } from '../types/products/PaginatedProducts'
import { ProductMutationResponse } from '../types/products/ProductMutationResponse'
import { UpdateProductInput } from '../types/products/UpdateProductInput'

@Resolver(_of => Product)
export class ProductResolver {
  @FieldResolver(_return => Category)
  async category(@Root() rootCategory: Product) {
    return await Category.findOne(rootCategory.categoryId)
  }

  @Mutation(_returns => ProductMutationResponse)
  @UseMiddleware(checkAuth)
  async createProduct(
    @Arg('createProductInput')
    { title, description, price, categoryId }: CreateProductInput
  ): Promise<ProductMutationResponse> {
    try {
      const newProduct = Product.create({
        title,
        description,
        price,
        categoryId
        // userId: req.session.userId,
      })

      await newProduct.save()

      return {
        code: 200,
        success: true,
        message: 'Thêm sản phẩm thành công',
        product: newProduct
      }
    } catch (error) {
      console.log(error)
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`
      }
    }
  }

  @Query(_return => PaginatedProducts, { nullable: true })
  @UseMiddleware(checkAuth)
  async products(
    @Arg('limit', _type => Int) limit: number,
    @Arg('cursor', { nullable: true }) cursor?: string
  ): Promise<PaginatedProducts | null> {
    try {
      const totalProductCount = await Product.count()
      const realLimit = Math.min(10, limit)

      const findOptions: { [key: string]: any } = {
        order: {
          createdAt: 'DESC'
        },
        take: realLimit
      }

      let lastProduct: Product[] = []
      if (cursor) {
        findOptions.where = { createdAt: LessThan(cursor) }

        lastProduct = await Product.find({
          order: { createdAt: 'ASC' },
          take: 1
        })
      }

      const products = await Product.find(findOptions)

      return {
        totalCount: totalProductCount,
        cursor: products[products.length - 1].createdAt,
        hasMore: cursor
          ? products[products.length - 1].createdAt.toString() !==
            lastProduct[0].createdAt.toString()
          : products.length !== totalProductCount,
        paginatedProducts: products
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  @Query(_return => Product, { nullable: true })
  @UseMiddleware(checkAuth)
  async product(
    @Arg('id', _type => ID) id: number
  ): Promise<Product | undefined> {
    try {
      const product = await Product.findOne(id)
      return product
    } catch (error) {
      console.log(error)
      return undefined
    }
  }

  @Mutation(_return => ProductMutationResponse)
  @UseMiddleware(checkAuth)
  async updateProduct(
    @Arg('updateProductInput')
    { id, title, description, price, categoryId }: UpdateProductInput
  ): // @Ctx() { req }: Context
  Promise<ProductMutationResponse> {
    const existingProduct = await Product.findOne(id)

    if (!existingProduct)
      return {
        code: 400,
        success: false,
        message: 'Không tìm thấy sản phẩm'
      }

    // if (existingProduct.userId !== req.session.userId) {
    //   return { code: 401, success: false, message: 'Lỗi chưa đăng nhập' }
    // }

    existingProduct.title = title
    existingProduct.description = description
    existingProduct.price = Number(price)
    existingProduct.categoryId = Number(categoryId)

    await existingProduct.save()

    return {
      code: 200,
      success: true,
      message: 'Đã thay đổi thông tin sản phẩm',
      product: existingProduct
    }
  }

  @Mutation(_return => ProductMutationResponse)
  @UseMiddleware(checkAuth)
  async deleteProduct(
    @Arg('id', _type => ID) id: number
    // @Ctx() { req }: Context
  ): Promise<ProductMutationResponse> {
    const existingProduct = await Product.findOne(id)

    if (!existingProduct)
      return {
        code: 400,
        success: false,
        message: 'Không tìm thấy sản phẩm'
      }

    // if (existingPost.userId !== req.session.userId) {
    //   return { code: 401, success: false, message: 'Lỗi chưa đăng nhập' }
    // }
    await Product.delete({ id })
    return { code: 200, success: true, message: 'Sản phẩm đã bị xoá' }
  }
}
