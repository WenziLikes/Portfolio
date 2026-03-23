import React from "react"
import styles from "./Card.module.scss"
import type {CardInfo} from "../../content/projects"

interface CardProps {
    card: CardInfo
    className?: string
    isDragOverlay?: boolean
    isPlaceholder?: boolean
    onReorderKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void
    onReorderPointerDown?: (event: React.PointerEvent<HTMLElement>) => void
    sequence?: string
    style?: React.CSSProperties
    variant?: "featured" | "compact"
}

const Card: React.FC<CardProps> = ({
    card,
    variant = "compact",
    className,
    isDragOverlay = false,
    isPlaceholder = false,
    onReorderKeyDown,
    onReorderPointerDown,
    sequence,
    style,
}) => {
    const {actions, description, eyebrow, featuredActionLabel, featuredDescription, image, proofPoints, scope, stack, title, year} = card
    const isFeatured = variant === "featured"
    const isContainedImage = image.fit === "contain"
    const visibleStack = isFeatured ? stack.slice(0, 6) : stack.slice(0, 4)
    const remainingStackCount = stack.length - visibleStack.length
    const visibleProofPoints = isFeatured ? proofPoints?.slice(0, 3) ?? [] : []
    const hasFeaturedProofPoints = visibleProofPoints.length > 0
    const visibleDescription = isFeatured ? featuredDescription ?? description : description
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
            className={`${styles.card} ${isFeatured ? styles.cardFeatured : styles.cardCompact} ${isContainedImage ? styles.cardContained : ""} ${isPlaceholder ? styles.cardPlaceholder : ""} ${isDragOverlay ? styles.cardDragOverlay : ""} ${isReorderable ? styles.cardReorderable : ""} ${className ?? ""}`}
            data-project-card-id={card.id}
            onKeyDown={onReorderKeyDown}
            onPointerDown={onReorderPointerDown}
            style={style}
            tabIndex={isReorderable ? 0 : undefined}
        >
            {isPointerReorderable && <span className={styles.card__dragHint}>Drag & drop</span>}

            <div className={styles.card__media} data-project-card-media>
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

            <div className={styles.card__content} data-project-card-content>
                <div className={styles.card__header}>
                    <div className={styles.card__meta}>
                        <span className={styles.card__eyebrow}>{eyebrow}</span>
                        <span className={styles.card__metaDivider}/>
                        <span className={styles.card__scope}>{year}</span>
                        <span className={styles.card__metaDivider}/>
                        <span className={styles.card__scope}>{scope}</span>
                    </div>

                    {sequence ? (
                        <span className={styles.card__sequence} aria-hidden="true">
                            {sequence}
                        </span>
                    ) : null}
                </div>

                <div className={styles.card__body}>
                    <h3 className={styles.card__title}>{title}</h3>
                    <p className={styles.card__description}>{visibleDescription}</p>
                </div>

                {hasFeaturedProofPoints ? (
                    <ul className={styles.card__proofs} aria-label={`${title} highlights`}>
                        {visibleProofPoints.map((point) => (
                            <li className={styles.card__proof} key={point}>
                                {point}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <ul className={styles.card__chips} aria-label={`${title} tech stack`}>
                        {visibleStack.map((item) => (
                            <li className={styles.card__chip} key={item}>
                                {item}
                            </li>
                        ))}
                        {remainingStackCount > 0 ? <li className={`${styles.card__chip} ${styles.card__chipMore}`}>+{remainingStackCount}</li> : null}
                    </ul>
                )}

                <div className={styles.card__actions}>
                    {actions.map((action) => (
                        <a
                            className={`${styles.card__button} ${isFeatured ? styles.card__buttonPrimary : styles.card__buttonGhost}`}
                            href={action.href}
                            key={action.label}
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            {isFeatured ? featuredActionLabel ?? action.label : action.label}
                        </a>
                    ))}
                </div>
            </div>
        </article>
    )
}

export default Card
