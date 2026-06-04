declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export = classes;
}

declare module "*.css";
declare module "*.png";
declare module "*.svg";
declare module "*.jpg";