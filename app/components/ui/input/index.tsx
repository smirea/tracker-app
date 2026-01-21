'use client';
import React from 'react';
import { createInput } from '@gluestack-ui/core/input/creator';
import {
  tva,
  withStyleContext,
  useStyleContext,
  type VariantProps,
} from '@gluestack-ui/utils/nativewind-utils';
import { cssInterop } from 'nativewind';
import { TextInput, View, Pressable } from 'react-native';
import { PrimitiveIcon, UIIcon } from '@gluestack-ui/core/icon/creator';

const SCOPE = 'INPUT';

const Root = withStyleContext(View, SCOPE);

const UIInput = createInput({
  Root: Root,
  Icon: UIIcon,
  Slot: Pressable,
  Input: TextInput,
});

cssInterop(UIInput, { className: 'style' });
cssInterop(UIInput.Input, {
  className: { target: 'style', nativeStyleToProp: { textAlign: true } },
});
cssInterop(PrimitiveIcon, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: 'classNameColor',
      stroke: true,
    },
  },
});

const inputStyle = tva({
  base: 'border border-outline-300 rounded flex-row items-center data-[focus=true]:border-primary-700 data-[focus=true]:web:ring-1 data-[focus=true]:web:ring-inset data-[focus=true]:web:ring-indicator-primary data-[disabled=true]:opacity-40 data-[disabled=true]:bg-background-50 data-[invalid=true]:border-error-700 data-[invalid=true]:web:ring-1 data-[invalid=true]:web:ring-inset data-[invalid=true]:web:ring-indicator-error data-[invalid=true]:data-[focus=true]:border-error-700 data-[invalid=true]:data-[focus=true]:web:ring-indicator-error data-[invalid=true]:data-[disabled=true]:border-error-700',
  variants: {
    variant: {
      underlined:
        'rounded-none border-x-0 border-t-0 border-b data-[invalid=true]:border-b-error-700 data-[focus=true]:border-b-primary-700 data-[invalid=true]:data-[focus=true]:border-b-error-700',
      outline: '',
      rounded: 'rounded-full',
    },
    size: {
      sm: 'h-9 px-3',
      md: 'h-10 px-3',
      lg: 'h-11 px-4',
      xl: 'h-12 px-4',
    },
  },
});

const inputFieldStyle = tva({
  base: 'flex-1 text-typography-900 web:cursor-text web:outline-0 placeholder:text-typography-400',
  parentVariants: {
    variant: {
      underlined: 'web:outline-0 web:outline-none',
      outline: 'web:outline-0 web:outline-none',
      rounded: 'web:outline-0 web:outline-none',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
  },
});

const inputSlotStyle = tva({
  base: 'justify-center items-center web:disabled:cursor-not-allowed',
  parentVariants: {
    variant: {
      underlined: '',
      outline: '',
      rounded: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
      xl: '',
    },
  },
});

const inputIconStyle = tva({
  base: 'fill-none text-typography-400',
  parentVariants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-5 w-5',
      xl: 'h-6 w-6',
    },
  },
});

type IInputProps = Omit<
  React.ComponentPropsWithoutRef<typeof UIInput>,
  'context'
> &
  VariantProps<typeof inputStyle> & { className?: string };

const Input = React.forwardRef<React.ElementRef<typeof UIInput>, IInputProps>(
  ({ className, variant = 'outline', size = 'md', ...props }, ref) => {
    return (
      <UIInput
        ref={ref}
        {...props}
        className={inputStyle({ variant, size, class: className })}
        context={{ variant, size }}
      />
    );
  }
);

type IInputFieldProps = React.ComponentPropsWithoutRef<typeof UIInput.Input> &
  VariantProps<typeof inputFieldStyle> & { className?: string };

const InputField = React.forwardRef<
  React.ElementRef<typeof UIInput.Input>,
  IInputFieldProps
>(({ className, ...props }, ref) => {
  const { variant: parentVariant, size: parentSize } = useStyleContext(SCOPE);

  return (
    <UIInput.Input
      ref={ref}
      {...props}
      className={inputFieldStyle({
        parentVariants: {
          variant: parentVariant,
          size: parentSize,
        },
        class: className,
      })}
    />
  );
});

type IInputSlotProps = React.ComponentPropsWithoutRef<typeof UIInput.Slot> &
  VariantProps<typeof inputSlotStyle> & { className?: string };

const InputSlot = React.forwardRef<
  React.ElementRef<typeof UIInput.Slot>,
  IInputSlotProps
>(({ className, ...props }, ref) => {
  const { variant: parentVariant, size: parentSize } = useStyleContext(SCOPE);

  return (
    <UIInput.Slot
      ref={ref}
      {...props}
      className={inputSlotStyle({
        parentVariants: {
          variant: parentVariant,
          size: parentSize,
        },
        class: className,
      })}
    />
  );
});

type IInputIconProps = React.ComponentPropsWithoutRef<typeof UIInput.Icon> &
  VariantProps<typeof inputIconStyle> & {
    className?: string;
    as?: React.ElementType;
    height?: number;
    width?: number;
  };

const InputIcon = React.forwardRef<
  React.ElementRef<typeof UIInput.Icon>,
  IInputIconProps
>(({ className, size, ...props }, ref) => {
  const { size: parentSize } = useStyleContext(SCOPE);

  if (typeof size === 'number') {
    return (
      <UIInput.Icon
        ref={ref}
        {...props}
        className={inputIconStyle({ class: className })}
        size={size}
      />
    );
  } else if (
    (props.height !== undefined || props.width !== undefined) &&
    size === undefined
  ) {
    return (
      <UIInput.Icon
        ref={ref}
        {...props}
        className={inputIconStyle({ class: className })}
      />
    );
  }
  return (
    <UIInput.Icon
      {...props}
      className={inputIconStyle({
        parentVariants: {
          size: parentSize,
        },
        size,
        class: className,
      })}
      ref={ref}
    />
  );
});

Input.displayName = 'Input';
InputField.displayName = 'InputField';
InputSlot.displayName = 'InputSlot';
InputIcon.displayName = 'InputIcon';

export { Input, InputField, InputSlot, InputIcon };
