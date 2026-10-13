import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';

import { FindAllQuery } from './find-all.query.ts';

describe('Testing dto: FindAllQuery', () => {
  it('defaults limit to 100 and offset to 0 when omitted', () => {
    const dto = plainToInstance(FindAllQuery, {});

    expect(dto.limit).toBe(100);
    expect(dto.offset).toBe(0);
  });

  it('rejects a negative limit', async () => {
    const dto = plainToInstance(FindAllQuery, { limit: -5 });

    const errors = await validate(dto);

    expect(errors).not.toEqual([]);
  });

  it('rejects a limit above the maximum of 10000', async () => {
    const dto = plainToInstance(FindAllQuery, { limit: 1_000_000_000 });

    const errors = await validate(dto);

    expect(errors).not.toEqual([]);
  });

  it('rejects a fractional offset', async () => {
    const dto = plainToInstance(FindAllQuery, { offset: 1.5 });

    const errors = await validate(dto);

    expect(errors).not.toEqual([]);
  });

  it('rejects a negative offset', async () => {
    const dto = plainToInstance(FindAllQuery, { offset: -1 });

    const errors = await validate(dto);

    expect(errors).not.toEqual([]);
  });
});
