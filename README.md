# aurelia-components 

HTML components for usage with [Aurelia](https://github.com/aurelia) and [TypeScript](https://github.com/Microsoft/TypeScript).

## Components

### `fluid-list`

Usage:

    <require from="path/to/fluid-list">
    <fluid-list values.bind="[ARRAY_EXPRESSION]" lock.bind="[LOCK_EXPRESSION]"></fluid-list

Parameters:

| Parameter | Description |
| --------- | ----------- |
| `[ARRAY_EXPRESSION]` | a JS array of string values to use as the data set |
| `[LOCK_EXPRESSION]` | a boolean literal determining whether or not the `<fluid-list>` should be locked or not at initialization |

Notes:

- Only one-way binding works with array (no output)
- Still a work in progress
