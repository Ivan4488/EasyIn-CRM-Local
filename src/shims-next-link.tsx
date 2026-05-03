import React from "react";
import { Link as RouterLink } from "react-router-dom";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
};

export default function Link({ href, children, ...rest }: Props) {
  return (
    <RouterLink to={href} {...rest}>
      {children}
    </RouterLink>
  );
}
