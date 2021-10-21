import { Field, ID, InputType, ObjectType } from 'type-graphql'

@InputType()
@ObjectType()
export class UpdateProductInput {
  @Field(_type => ID)
  id: number

  @Field()
  title: string

  @Field()
  description: string

  @Field()
  price: number

  @Field()
  categoryId: number

  @Field(() => [String])
  images: string[]
}

// custom type
// {
//     "data": {
//     "project": {
//       "name": "Project 1"
//       languages{
//           names{
//              "Python"
//              "HTML"
//               }
//             }
//          }
//         }
//        }

// const ProjectType = new GraphQLObjectType({
//   name: 'Project',
//   fields: () => ({
//     id: { type: GraphQLID },
//     name: { type: GraphQLString },
//     subtitle: { type: GraphQLString },
//     summary: { type: GraphQLString },
//     languages: {
//       // change this type to LanguageType
//       type: new GraphQLList(LanguageType),
//       resolve(parent, args) {
//         // No need to lodash here
//         return languages.filter(language => {
//           return parent.languageId.includes(language.id)
//         })
//       }
//     }
//   })
// })
