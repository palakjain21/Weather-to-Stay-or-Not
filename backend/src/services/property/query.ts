import { Prisma } from "@prisma/client";
import { GetPropertiesParams, PropertyQueryBuilder } from "./types";

export const buildPropertyWhere: PropertyQueryBuilder = (params: GetPropertiesParams): Prisma.PropertyWhereInput | undefined => {
  const { searchText } = params;

  if (!searchText || searchText.trim().length === 0) {
    return undefined;
  }

  const query = searchText.trim();

  return {
    OR: [
      { name: { contains: query } },
      { city: { contains: query } },
      { state: { contains: query } },
    ],
  };
};
