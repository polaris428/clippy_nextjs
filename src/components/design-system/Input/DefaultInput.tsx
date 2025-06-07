import React, {
  InputHTMLAttributes,
  forwardRef,
  Ref,
} from 'react';
import classNames from 'classnames';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const DefaultInput = forwardRef(function Input(
  { className, ...props }: InputProps,
  ref: Ref<HTMLInputElement>
) {
  return (
    <input
      ref={ref}
      className={classNames(
        'w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black',
        className
      )}
      {...props}
    />
  );
});
export default DefaultInput;