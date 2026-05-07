import * as React from "react";

/**
 * Recursively clones React children, injecting `props` into any element
 * whose `displayName` is included in `targetDisplayNames`.
 */
export function recursiveCloneChildren(
  children: React.ReactNode,
  props: Record<string, unknown>,
  targetDisplayNames: string[],
  uniqueId?: string,
  asChild?: boolean,
): React.ReactNode {
  if (asChild) return children;

  return React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;

    const childType = child.type as React.ComponentType & { displayName?: string };
    const displayName = childType?.displayName;

    const childProps = child.props as { children?: React.ReactNode } & Record<string, unknown>;

    const newChildren = childProps?.children
      ? recursiveCloneChildren(
          childProps.children,
          props,
          targetDisplayNames,
          uniqueId,
          (childProps as { asChild?: boolean }).asChild,
        )
      : childProps?.children;

    if (displayName && targetDisplayNames.includes(displayName)) {
      return React.cloneElement(
        child,
        {
          ...props,
          key: uniqueId ? `${uniqueId}-${index}` : index,
        },
        newChildren,
      );
    }

    return React.cloneElement(child, {}, newChildren);
  });
}
