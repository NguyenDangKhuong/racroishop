// import { Context } from '../types/Context'
import { Query, Resolver } from 'type-graphql'

@Resolver()
export class HelloResolver {
	@Query(_returns => String)
	hello(
		// @Ctx() { req }: Context
		) {
		// console.log(req.session.userId)
		return 'hello world'
	}
}