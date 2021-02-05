/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable new-cap */
import {
  ObjectType,
  InputType,
  Field,
  ID,
  Float,
  Int,
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Authorized,
} from 'type-graphql';
import {Min, Max} from 'class-validator';
import {getBoundsOfDistance} from 'geolib';
import {Context, AuthorizedContext} from './context';

@InputType()
class CoordinatesInput {
  @Min(-90)
  @Max(90)
  @Field((_type) => Float)
  latitude!: number;

  @Min(-180)
  @Max(180)
  @Field((_type) => Float)
  longitude!: number;
}

@InputType()
class BoundsInput {
  @Field((_type) => CoordinatesInput)
  sw!: CoordinatesInput;

  @Field((_type) => CoordinatesInput)
  ne!: CoordinatesInput;
}

@InputType()
class HackafestInput {
  @Field((_type) => String)
  address!: string;

  @Field((_type) => String)
  image!: string;

  @Field((_type) => CoordinatesInput)
  coordinates!: CoordinatesInput;

  @Field((_type) => String)
  title!: string;

  @Field((_type) => String)
  date!: string;

  @Field((_type) => String)
  time!: string;
}

@ObjectType()
class Hackafest {
  @Field((_type) => ID)
  id!: number;

  @Field((_type) => String)
  userId!: string;

  @Field((_type) => Float)
  latitude!: number;

  @Field((_type) => Float)
  longitude!: number;

  @Field((_type) => String)
  address!: string;

  @Field((_type) => String)
  image!: string;

  @Field((_type) => String)
  publicId(): string {
    const parts = this.image.split('/');
    return parts[parts.length - 1];
  }

  @Field((_type) => String)
  title!: string;

  @Field((_type) => String)
  time!: string;

  @Field((_type) => String)
  date!: string;

  @Field((_type) => [Hackafest])
  async nearby(@Ctx() ctx: Context) {
    const bounds = getBoundsOfDistance(
        {latitude: this.latitude, longitude: this.longitude},
        10000,
    );

    return ctx.prisma.hackafest.findMany({
      where: {
        latitude: {gte: bounds[0].latitude, lte: bounds[1].latitude},
        longitude: {gte: bounds[0].longitude, lte: bounds[1].longitude},
        id: {not: {equals: this.id}},
      },
      take: 25,
    });
  }
}

@Resolver()
export class HackafestResolver {
  @Query((_returns) => Hackafest, {nullable: true})
  async hackafest(@Arg('id') id: string, @Ctx() ctx: Context) {
    return ctx.prisma.hackafest.findUnique({where: {id: parseInt(id, 10)}});
  }

  @Query((_returns) => [Hackafest], {nullable: false})
  async hackafests(@Arg('bounds') bounds: BoundsInput, @Ctx() ctx: Context) {
    return ctx.prisma.hackafest.findMany({
      where: {
        latitude: {gte: bounds.sw.latitude, lte: bounds.ne.latitude},
        longitude: {gte: bounds.sw.longitude, lte: bounds.ne.longitude},
      },
      take: 50,
    });
  }

  @Authorized()
  @Mutation((_returns) => Hackafest, {nullable: true})
  async createHackafest(
    @Arg('input') input: HackafestInput,
    @Ctx() ctx: AuthorizedContext,
  ) {
    return await ctx.prisma.hackafest.create({
      data: {
        userId: ctx.uid,
        image: input.image,
        address: input.address,
        latitude: input.coordinates.latitude,
        longitude: input.coordinates.longitude,
        title: input.title,
        time: input.time,
        date: input.date,
      },
    });
  }

  @Authorized()
  @Mutation((_returns) => Hackafest, {nullable: true})
  async updateHackafest(
    @Arg('id') id: string,
    @Arg('input') input: HackafestInput,
    @Ctx() ctx: AuthorizedContext,
  ) {
    const hackafestId = parseInt(id, 10);
    const hackafest = await ctx.prisma.hackafest.findUnique({
      where: {id: hackafestId},
    });

    if (!hackafest || hackafest.userId !== ctx.uid) return null;

    return await ctx.prisma.hackafest.update({
      where: {id: hackafestId},
      data: {
        image: input.image,
        address: input.address,
        latitude: input.coordinates.latitude,
        longitude: input.coordinates.longitude,
        title: input.title,
        time: input.time,
        date: input.date,
      },
    });
  }

  @Authorized()
  @Mutation((_returns) => Boolean, {nullable: false})
  async deleteHackafest(
    @Arg('id') id: string,
    @Ctx() ctx: AuthorizedContext,
  ): Promise<boolean> {
    const hackafestId = parseInt(id, 10);
    const hackafest = await ctx.prisma.hackafest.findUnique({
      where: {id: hackafestId},
    });

    if (!hackafest || hackafest.userId !== ctx.uid) return false;

    await ctx.prisma.hackafest.delete({
      where: {id: hackafestId},
    });
    return true;
  }
}
