import React from "react"
import styles from "./Card.module.scss"
import type {CardInfo} from "../../content/projects"

interface CardProps {
    card: CardInfo
    isDragOverlay?: boolean
    isPlaceholder?: boolean
    onReorderKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void
    onReorderPointerDown?: (event: React.PointerEvent<HTMLElement>) => void
    style?: React.CSSProperties
    variant?: "featured" | "compact"
}

const Card: React.FC<CardProps> = ({
    card,
    variant = "compact",
    isDragOverlay = false,
    isPlaceholder = false,
    onReorderKeyDown,
    onReorderPointerDown,
    style,
}) => {
    const {actions, description, eyebrow, image, scope, stack, title, year} = card
    const isFeatured = variant === "featured"
    const isContainedImage = image.fit === "contain"
    const isPointerReorderable = !isDragOverlay && !isPlaceholder && Boolean(onReorderPointerDown)
    const isReorderable = !isDragOverlay && !isPlaceholder && Boolean(onReorderPointerDown || onReorderKeyDown)
    const reorderLabel = isReorderable
        ? isPointerReorderable
            ? `${title}. Drag and drop to reorder.`
            : `${title}. Use keyboard to reorder.`
        : undefined
    const imageStyle = {
        "--card-image-frame-inset": image.frameInset ?? "5.6rem",
        "--card-image-translate-y": image.panelInsetBottom ?? "0px",
        "--card-image-mobile-translate-y": image.panelInsetBottomMobile ?? "0px",
        "--card-image-scale": image.scale ?? 1.01,
        "--card-image-hover-scale": image.hoverScale,
    } as React.CSSProperties
    const coverImageStyle = {
        ...imageStyle,
        objectFit: image.fit ?? "cover",
        objectPosition: image.position ?? "center",
    } as React.CSSProperties
    const containedImageStyle = {
        objectPosition: image.position ?? "center",
    } as React.CSSProperties

    return (
        <article
            aria-grabbed={isPlaceholder || undefined}
            aria-hidden={isDragOverlay || undefined}
            aria-label={reorderLabel}
            className={`${styles.card} ${isFeatured ? styles.cardFeatured : styles.cardCompact} ${isContainedImage ? styles.cardContained : ""} ${isPlaceholder ? styles.cardPlaceholder : ""} ${isDragOverlay ? styles.cardDragOverlay : ""} ${isReorderable ? styles.cardReorderable : ""}`}
            data-project-card-id={card.id}
            onKeyDown={onReorderKeyDown}
            onPointerDown={onReorderPointerDown}
            style={style}
            tabIndex={isReorderable ? 0 : undefined}
        >
            {isPointerReorderable && <span className={styles.card__dragHint}>Drag & drop</span>}

            <div className={styles.card__media}>
                {isContainedImage ? (
                    <div className={styles.card__containedFrame} style={imageStyle}>
                        <img
                            className={`${styles.card__background} ${styles.card__backgroundContained}`}
                            src={image.src}
                            srcSet={image.srcSet}
                            sizes={image.sizes}
                            width={image.width}
                            height={image.height}
                            loading="lazy"
                            decoding="async"
                            draggable={false}
                            alt={image.alt}
                            style={containedImageStyle}
                        />
                    </div>
                ) : (
                    <img
                        className={styles.card__background}
                        src={image.src}
                        srcSet={image.srcSet}
                        sizes={image.sizes}
                        width={image.width}
                        height={image.height}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        alt={image.alt}
                        style={coverImageStyle}
                    />
                )}
            </div>

            <div className={styles.card__content}>
                <div className={styles.card__meta}>
                    <span className={styles.card__eyebrow}>{eyebrow}</span>
                    <span className={styles.card__metaDivider}/>
                    <span className={styles.card__scope}>{year}</span>
                    <span className={styles.card__metaDivider}/>
                    <span className={styles.card__scope}>{scope}</span>
                </div>

                <div className={styles.card__body}>
                    <h3 className={styles.card__title}>{title}</h3>
                    <p className={styles.card__description}>{description}</p>
                </div>

                <ul className={styles.card__chips} aria-label={`${title} tech stack`}>
                    {stack.map((item) => (
                        <li className={styles.card__chip} key={item}>
                            {item}
                        </li>
                    ))}
                </ul>

                <div className={styles.card__actions}>
                    {actions.map((action) => (
                        <a
                            className={`${styles.card__button} ${isFeatured ? styles.card__buttonPrimary : styles.card__buttonGhost}`}
                            href={action.href}
                            key={action.label}
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            {action.label}
                        </a>
                    ))}
                </div>
            </div>
        </article>
    )
}

export default Card
