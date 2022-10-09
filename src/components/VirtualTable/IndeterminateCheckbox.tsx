import React, { useContext } from 'react';
import { VirtualTableContext, checkBoxWidth, dragIconWidth } from './consts';

const IndeterminateCheckbox = React.forwardRef(
  (
    {
      indeterminate = false,
      ...rest
    }: { indeterminate?: boolean } & React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    ref: any
  ) => {
    const { fixedLeftCount, canDragSortRow } = useContext(VirtualTableContext);

    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <div
        className="sticky z-50 flex h-full items-center bg-inherit px-3"
        style={{
          boxShadow: fixedLeftCount === 0 ? '2px 0 4px 0px #eee' : 'unset',
          width: checkBoxWidth,
          left: canDragSortRow ? dragIconWidth : 0,
        }}
      >
        <input
          type="checkbox"
          className="checkbox checkbox-sm"
          ref={resolvedRef}
          onChange={() => undefined}
          {...rest}
        />
      </div>
    );
  }
);

IndeterminateCheckbox.displayName = 'IndeterminateCheckbox';

export default IndeterminateCheckbox;
