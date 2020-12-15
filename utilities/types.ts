import { FormControl } from '@angular/forms';

export type Form<T> = { [K in keyof T]?: FormControl };
