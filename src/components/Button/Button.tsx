import cx from 'classnames';
import type {
  ComponentPropsWithRef,
  ElementType,
  HTMLAttributeAnchorTarget,
  ReactNode,
} from 'react';
import { forwardRef } from 'react';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  active?: boolean;
  alignment?: 'left' | 'center' | 'right';
  beforeComponent?: ReactNode;
  afterComponent?: ReactNode;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  icon?: string;
  intent?: 'default' | 'primary' | 'danger' | 'dynamic';
  intentClassName?: string;
  loading?: boolean;
  paddingClassName?: string;
  roundedClassName?: string;
  setSize?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
  sizeClassName?: string;
  text?: string;
  textClassName?: string;
  type?: 'submit' | 'reset' | 'button';
  variant?: 'normal' | 'outlined' | 'solid' | 'minimal' | 'ghost' | 'fade' | 'link';
  variantClassName?: string;
  target?: HTMLAttributeAnchorTarget;
  Component?: ElementType;
}

const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(
  (
    {
      active = false,
      alignment = 'center',
      beforeComponent,
      afterComponent,
      children,
      className,
      disabled = false,
      icon,
      intent = 'default',
      intentClassName,
      loading = false,
      paddingClassName,
      roundedClassName,
      setSize = 'md',
      sizeClassName,
      text,
      textClassName,
      type = 'button',
      variant = 'normal',
      variantClassName,
      target,
      Component = 'button',
      ...rest
    },
    ref
  ) => {
    const alignmentClass = cx({
      'text-left justify-start': alignment === 'left',
      'text-center justify-center': alignment === 'center',
      'text-right justify-end': alignment === 'right',
    });

    const textClass =
      textClassName ||
      cx('font-medium', {
        'text-lg': setSize === 'lg',
        'text-md': setSize === 'md',
        'text-sm': setSize === 'sm',
        'text-xs': setSize === 'xs',
        'text-xxs': setSize === 'xxs',
      });

    const sizeClass =
      sizeClassName ||
      cx({
        'h-lg min-w-lg': setSize === 'lg',
        'h-md min-w-md': setSize === 'md',
        'h-sm min-w-sm': setSize === 'sm',
        'h-xs min-w-xs': setSize === 'xs',
        'h-xxs min-w-xxs': setSize === 'xxs',
      });

    const paddingClass =
      paddingClassName ||
      cx({
        'px-5': setSize === 'lg',
        'px-4': setSize === 'md',
        'px-3': setSize === 'sm',
        'px-2': setSize === 'xs',
        'px-1': setSize === 'xxs',
      });

    const roundedClass =
      roundedClassName ||
      cx({
        'rounded-lg': setSize === 'lg',
        rounded: setSize === 'md',
        'rounded-sm': setSize === 'sm',
        'rounded-xs': setSize === 'xs',
        'rounded-xxs': setSize === 'xxs',
      });

    const intentClass =
      intentClassName ||
      cx({
        default: intent === 'default',
        primary: intent === 'primary',
        danger: intent === 'danger',
        dynamic: intent === 'dynamic',
      });

    const variantClass =
      variantClassName ||
      cx({
        normal: variant === 'normal',
        minimal: variant === 'minimal',
        outlined: variant === 'outlined',
        solid: variant === 'solid',
        ghost: variant === 'ghost',
        fade: variant === 'fade',
        link: variant === 'link',
      });

    const rootClass = cx(
      'tx-button group',
      alignmentClass,
      textClass,
      roundedClass,
      intentClass,
      variantClass,
      {
        [paddingClass]: text && variant !== 'link',
        [sizeClass]: variant !== 'link',
        disabled,
        active,
        'pointer-events-none': loading,
      },
      className
    );

    const disabledState = Component === 'a' ? undefined : disabled;
    const typeState = Component === 'a' ? undefined : type;
    const pressedState = Component === 'a' ? undefined : active;
    const targetState = Component === 'a' ? target : undefined;

    const beforeIcon = (
      <div className={cx(icon, { '-ml-0.5 mr-2': text }, { invisible: loading })} />
    );

    return (
      <Component
        aria-busy={loading}
        aria-disabled={disabled}
        aria-label={text}
        aria-pressed={pressedState}
        className={rootClass}
        disabled={disabledState}
        type={typeState}
        target={targetState}
        ref={ref}
        {...rest}
      >
        {beforeComponent}
        {icon && beforeIcon}
        {text && <span className={cx('truncate', { invisible: loading })}>{text}</span>}
        {afterComponent}
        {children}
      </Component>
    );
  }
);

Button.displayName = 'Button';

export default Button;
