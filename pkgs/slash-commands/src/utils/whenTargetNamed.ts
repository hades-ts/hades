import type { BindingConstraints } from "inversify";

export const whenTargetNamedConstraint: (
    name: string,
) => (bindingconstraints: BindingConstraints) => boolean =
    (name: string) =>
    (bindingconstraints: BindingConstraints): boolean =>
        bindingconstraints.name === name;
