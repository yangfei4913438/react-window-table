import React, { useContext } from 'react';
import cx from 'classnames';
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
        className={cx(
          'indeterminate_checkbox_wrapper',
          fixedLeftCount === 0 && 'indeterminate_checkbox_wrapper_shadow'
        )}
        style={{
          width: checkBoxWidth,
          left: canDragSortRow ? dragIconWidth : 0,
        }}
      >
        <input
          type="checkbox"
          className="indeterminate_checkbox"
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
