declare module "*.jpg"
declare module "*.JPG"
declare module "*.png"
declare module "*.svg"
declare module "*.webp"
declare module "*.avif"

declare module "*.module.scss" {
    const classes: Record<string, string>
    export = classes
}

declare module "*.module.sass" {
    const classes: Record<string, string>
    export = classes
}

declare module "*.module.css" {
    const classes: Record<string, string>
    export = classes
}
