import React from "react";
import { PortalRoute, ROUTE_CONFIGS, navigateTo } from "../utils/router";

interface PortalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  route: PortalRoute;
  hash?: string;
  className?: string;
  children: React.ReactNode;
}

export const PortalLink: React.FC<PortalLinkProps> = ({
  route,
  hash,
  className,
  children,
  onClick,
  ...rest
}) => {
  const config = ROUTE_CONFIGS[route];
  const href = config.path + (hash ? `#${hash}` : "");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    // Apenas intercepta clique com botão esquerdo e sem teclas modificadoras (Ctrl/Cmd/Shift/Alt)
    if (
      !e.defaultPrevented &&
      e.button === 0 &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.altKey &&
      !e.shiftKey
    ) {
      e.preventDefault();
      navigateTo(route, hash);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  );
};
