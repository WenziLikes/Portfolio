const CHARACTER_SHIFT = 2

const MAILTO_SCHEME_CODES = [111, 99, 107, 110, 118, 113] as const
const EMAIL_LOCAL_PART_CODES = [120, 107, 99, 101, 106, 103, 117, 110, 99, 120, 111, 119, 116, 99, 109, 106, 107, 112] as const
const EMAIL_DOMAIN_LABEL_CODES = [107, 101, 110, 113, 119, 102] as const
const EMAIL_DOMAIN_TLD_CODES = [101, 113, 111] as const

const decodeContactPart = (codes: readonly number[]) => {
    return codes.map((code) => String.fromCharCode(code - CHARACTER_SHIFT)).join("")
}

const getEmailDomainLabel = () => decodeContactPart(EMAIL_DOMAIN_LABEL_CODES)

const getEmailDomainTld = () => decodeContactPart(EMAIL_DOMAIN_TLD_CODES)

export const getEmailAddress = () => {
    return `${decodeContactPart(EMAIL_LOCAL_PART_CODES)}@${getEmailDomainLabel()}.${getEmailDomainTld()}`
}

export const getEmailHref = () => {
    return `${decodeContactPart(MAILTO_SCHEME_CODES)}:${getEmailAddress()}`
}

export const getObfuscatedEmailText = () => {
    return `${decodeContactPart(EMAIL_LOCAL_PART_CODES)} [at] ${getEmailDomainLabel()} [dot] ${getEmailDomainTld()}`
}

export const openEmailComposer = () => {
    if (typeof window === "undefined") {
        return
    }

    window.location.href = getEmailHref()
}
