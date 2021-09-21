import { Arg, ID, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Product } from '../entities/Product';
import { checkAuth } from '../middleware/checkAuth';
import { CreateProductInput } from '../types/CreateProductInput';
import { ProductMutationResponse } from '../types/ProductMutationResponse';
import { UpdateProductInput } from '../types/UpdateProductInput';

@Resolver()
export class ProductResolver {
  @Mutation((_returns) => ProductMutationResponse)
  @UseMiddleware(checkAuth)
  async createProduct(
    @Arg('createProductInput') { title, description, price }: CreateProductInput
  ): Promise<ProductMutationResponse> {
    try {
      const newProduct = Product.create({
        title,
        description,
        price,
        // userId: req.session.userId,
      });

      await newProduct.save();

      return {
        code: 200,
        success: true,
        message: 'Thêm sản phẩm thành công',
        product: newProduct,
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      };
    }
  }

  @Query((_return) => [Product], { nullable: true })
  @UseMiddleware(checkAuth)
  async products(): Promise<Product[] | null> {
    try {
      return await Product.find();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Query((_return) => Product, { nullable: true })
  @UseMiddleware(checkAuth)
  async product(
    @Arg('id', (_type) => ID) id: number
  ): Promise<Product | undefined> {
    try {
      const product = await Product.findOne(id);
      return product;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  @Mutation((_return) => ProductMutationResponse)
  @UseMiddleware(checkAuth)
  async updateProduct(
    @Arg('updateProductInput')
    { id, title, description, price }: UpdateProductInput
  ): Promise<ProductMutationResponse> {
    const existingProduct = await Product.findOne(id);

    if (!existingProduct)
      return {
        code: 400,
        success: false,
        message: 'Không tìm thấy sản phẩm',
      };

    existingProduct.title = title;
    existingProduct.description = description;
    existingProduct.price = Number(price);

    await existingProduct.save();

    return {
      code: 200,
      success: true,
      message: 'Đã thay đổi thông tin sản phẩm',
      product: existingProduct,
    };
  }

  @Mutation((_return) => ProductMutationResponse)
  @UseMiddleware(checkAuth)
  async deleteProduct(
    @Arg('id', (_type) => ID) id: number
  ): Promise<ProductMutationResponse> {
    const existingProduct = await Product.findOne(id);

    if (!existingProduct)
      return {
        code: 400,
        success: false,
        message: 'Không tìm thấy sản phẩm',
      };
    await Product.delete({ id });
    return { code: 200, success: true, message: 'Sản phẩm đã bị xoá' };
  }
}
