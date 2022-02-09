## WEEKLY-TABLE

React weekly scheduler <br/>
By default build time ranges for a week, supports up to 31 days <br/>
Can work with different timezones, data always return to UTC+0

#### [Try Demo](https://imn-d.github.io/weekly-table/)

#### [NPM package](https://www.npmjs.com/package/react-weekly-table)

### Quick Start

Parent object must have sizing and `relative` prop <br/>
Other input props describing by `SchedulerInputProps`

```jsx
import React from 'react';

import Scheduler from './Scheduler';

const ref = useRef(null);

<div style={{ width: 1000, heigth: 600, position: 'relative' }} ref={ref}>
  <Scheduler parentRef={ref} />
</div>;
```

### About

- react and react-dom ^17.0.2 is a peerDependencies
- component uses PointerLock API
- no prod deps, no polyfills
- tested on latest Chrome-based and Firefox
- component DON'T support controlled state
- don't uses a dates and datetimes

### Usage

Recommended to use `React.lazy` for component

```jsx
const Scheduler = React.lazy(() => import('react-weekly-table'));
```

If you need load state from a database you must use two useState hooks <br>
To clear area pass empty array to `defaultValue`

```jsx
const [initValue, setInitValue] = useState<ScheduleGroup[]>([]);
const [output, setOutput] = useState<ScheduleGroup[]>([]);

const clearArea = () => setInitValue([]);

<Scheduler parentRef={ref} defaultValue={initValue} onChange={(values) => setOutput(values)} />
```

Changing blocks colors by `BlockColorsProps`

```jsx
<Scheduler
  parentRef={ref}
  blockColors={{
    common: '#ff5722',
    temp: '#c6a700',
    draw: '#ff8a50',
    hover: '#ff3d00',
  }}
/>
```

Changing sizes of rows and columns headers

```jsx
<Scheduler
  parentRef={ref}
  headerHeightProp={80}
  helperWidthProp={80}
  bottomHeightProp={20}
/>
```

Changing columns length and descriptions by `SchedulerColumnsProps` <br/>
*Note:* short field not implemented right now, but it's required <br />
**weight** - bit mask, your columns must guarantee number sequence (2^0, 2^1, 2^2, ...) 
```jsx
import { schedulerColumns } from 'react-weekly-table';

const myColumns = [{full: 'Name1', short: 'n1', weight: 128}, {full: 'Name2', short: 'n2', weight: 256}]

const extraColumns = [...schedulerColumns].concat(myColumns)
<Scheduler
  parentRef={ref}
  columns={extraColumns}
/>;
```
Changing rows descriptions by `string[]`
```jsx
import { schedulerRows } from 'react-weekly-table';

<Scheduler
  parentRef={ref}
  rows={['time1', 'time2', 'time3']}
/>;
```

We have hotkeys <br />
- *delete or backspace* when block is hovered
- *ctrl+z* undo history


See **demo** folder for examples <br />
Default css located also there

### Scripts

- build - integration build (as react component)
- demo:prod - demonstration build
- serve - dev server
- test - run tests
