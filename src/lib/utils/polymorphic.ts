import * as React from "react";

type AsProp<C extends React.ElementType> = {
  as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentPropWithRef<
  C extends React.ElementType,
  P = {},
> = React.PropsWithChildren<P & AsProp<C>> &
  Omit<React.ComponentPropsWithRef<C>, PropsToOmit<C, P>>;

export type PolymorphicComponentProps<
  C extends React.ElementType,
  P = {},
> = PolymorphicComponentPropWithRef<C, P>;

export type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>["ref"];
