import { Transform } from 'class-transformer';

export const TransformToBoolean = () =>
  Transform(({ value }) => {
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    else return Boolean(value);
  });
