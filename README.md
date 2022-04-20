# racroishop

## CLIENT

1.gennerate graphql file in client

> yarn codegen

## SERVER

**run docker development**
1.terminal 1:

> yarn watch

2.terminal 2:

> docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

**run docker prodcution**

> docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

**docker build**

> docker build -t {{development/production}-tag}(tên container đặt tên gì cũng đc) -f ./docker/{dev/prod}.Dockerfile .
> docker build -t production -f DockerProd.DockerFile .
