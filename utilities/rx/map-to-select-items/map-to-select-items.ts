import { SelectItem } from 'primeng/api';
import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export interface MapToSelectItemsOptions<TItem> {
  labelGetter: (item: TItem) => string;
  valueGetter: (item: TItem) => unknown;
  defaultLabel?: string;
  defaultValue?: unknown;
  multi?: boolean;
  stringifyValue?: boolean;
}

export function mapToSelectItems<TItem>({
  labelGetter,
  valueGetter,
  defaultLabel,
  defaultValue,
  multi = false,
  stringifyValue = false,
}: MapToSelectItemsOptions<TItem>): OperatorFunction<TItem[], SelectItem[]> {
  return map((data: TItem[]) => {
    const selectItems = data
      .filter((item) => item != null)
      .map(
        (item): SelectItem => ({
          label: labelGetter(item),
          value: stringifyValue
            ? valueGetter(item).toString()
            : valueGetter(item),
        }),
      );

    if (multi) {
      return selectItems;
    }

    if (defaultValue !== undefined && defaultLabel != null) {
      return [{ label: defaultLabel, value: defaultValue }, ...selectItems];
    }

    return selectItems;
  });
}
