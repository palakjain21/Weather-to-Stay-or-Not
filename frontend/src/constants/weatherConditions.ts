export interface WeatherCondition {
  value: number[];
  label: string;
  group: string;
}

export const weatherConditions: WeatherCondition[] = [
  { value: [0], label: 'Clear sky', group: 'Clear' },
  { value: [1], label: 'Partly cloudy', group: 'Cloudy' },
  { value: [2], label: 'Mostly cloudy', group: 'Cloudy' },
  { value: [3], label: 'Overcast', group: 'Cloudy' },
  { value: [51], label: 'Light drizzle', group: 'Drizzle' },
  { value: [52, 53, 54, 55], label: 'Moderate drizzle', group: 'Drizzle' },
  { value: [56, 57], label: 'Dense drizzle', group: 'Drizzle' },
  { value: [61, 62], label: 'Light rain showers', group: 'Rainy' },
  { value: [63, 64, 65], label: 'Moderate rain showers', group: 'Rainy' },
  { value: [66, 67], label: 'Heavy rain showers', group: 'Rainy' },
  { value: [80, 81, 82], label: 'Light to heavy rain', group: 'Rainy' },
  { value: [71, 72, 73, 74, 75, 76, 77, 85, 86], label: 'Snow showers', group: 'Snow' }
];
