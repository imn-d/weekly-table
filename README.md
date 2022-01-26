## WEEKLY-TABLE

React weekly scheduler <br/>
By default build time ranges for a week, supports up to 31 days<br/>
Can work with different timezones, data always return to UTC+0

#### [Try Demo](https://imn-d.github.io/weekly-table/) 

### Usage

Parent object must have sizing and `relative` prop<br/>
Other input props describing by `SchedulerInputProps`<br/>
```jsx
import React from 'react';
import Scheduler from './Scheduler';

const ref = useRef(null);

<div style={{ width: 1000, heigth: 600, position: 'relative' }} ref={ref}>
  <Scheduler parentRef={ref} />
</div>;
```

### Scripts
- build - integration build (as react component)
- demo:prod - demonstration build
- serve - dev server
- test - run tests