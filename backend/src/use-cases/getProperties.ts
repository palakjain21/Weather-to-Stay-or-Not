import { Request, Response } from "express";
import { getProperties as getPropertiesService } from "../services/property";
import { GetPropertiesParams } from "../services/property/types";

export const getProperties = async (req: Request, res: Response) => {
  try {
    const params: GetPropertiesParams = {
      searchText: req.query.searchText as string | undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      weatherFilters: {
        ...(req.query.temperatureMin && req.query.temperatureMax && {
          temperature: {
            min: parseFloat(req.query.temperatureMin as string),
            max: parseFloat(req.query.temperatureMax as string)
          }
        }),
        ...(req.query.humidityMin && req.query.humidityMax && {
          humidity: {
            min: parseFloat(req.query.humidityMin as string),
            max: parseFloat(req.query.humidityMax as string)
          }
        }),
        ...(req.query.weatherCondition && {
          weatherCondition: {
            codes: (req.query.weatherCondition as string).split(',').map(code => parseInt(code))
          }
        })
      }
    };

    const result = await getPropertiesService(params);

    if (result.error) {
      return res.status(500).json({ error: result.error });
    }

    return res.json(result.properties);
  } catch (error) {
    console.error("Error in getProperties use case:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};