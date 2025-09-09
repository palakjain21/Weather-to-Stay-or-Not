```txt
openmetro is an opensource weather data repository. We can use their api to fetch weather data based on lat and long. Given below is the api documentation

curl "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m" 
{
  ...
  "current": {
    "time": "2022-01-01T15:00",
    "temperature_2m": 2.4,
    "wind_speed_10m": 11.9,
  },
  "hourly": {
    "time": ["2022-07-01T00:00","2022-07-01T01:00", ...],
    "wind_speed_10m": [3.16,3.02,3.3,3.14,3.2,2.95, ...],
    "temperature_2m": [13.7,13.3,12.8,12.3,11.8, ...],
    "relative_humidity_2m": [82,83,86,85,88,88,84,76, ...],
  }
}
Your task is to complete this openmetro.ts resource file.
Remember to write modular code with functional structure approach
```

```txt
Generate a cache service in this file. The service should have get, set and clear cache methods with time to live implementation. The cache data would be stored in a local hashmap.
```

```txt
Generate a comprehensive Readme.md describing the following:
- How did we applied third party filter with pagination. The approach we use.
- Mention the cursor based pagination.
- Also write a brief API documentaion
- Add the assumption that data set is very large. Like vast.
- Mention that if it was a small data set then the solution would have been a cron worker updating the temperature in job table hourly (since weather data gets stale in about an hour).
- We have used a mock cache service instead of Redis.
- Anything else you might feel useful
```

```txt
Restructure the code in this file to improve readability and maintainability. Specifically:
-Move these constants into a separate constants file @weatherConditions.ts.
-Replace their usages in the main file with imports/references from the constants file.
-Do not change the core logic—focus only on code organization, readability, and maintainability.
```

```txt
Refactor this filter code into a generic filter component so it can be reused for both temperature and humidity filtering. 
-Extract common filter logic into a single reusable component.
-Accept functions and variables as props (e.g., label, unit, minValue, maxValue, minConstraint, maxConstraint, onChange).
-Ensure the component dynamically updates based on the props passed.
-Replace hardcoded references like temperature or humidity with prop-based values.
-Keep the code clean, maintainable, and easy to extend for additional filters in the future.
```

```txt
Read this file carefully and refactor the code to improve readability, maintainability, and efficiency. Specifically:
-Identify and remove redundant or duplicate code.
-Simplify overly complicated logic or structures without changing functionality.
-Preserve existing functionality, but make the code cleaner, more concise, and easier to maintain.
```

```txt
Create a group-based dropdown component using the provided weatherConditions constants.
-Group options in the dropdown by their group field ("Clear", "Cloudy", "Rainy", "Snow").
-Each option should display its label, but the underlying value should be its value array.
-Add a default option “All” at the top of the dropdown.
-Ensure the dropdown UI is clean, with clear separation between groups.
```

