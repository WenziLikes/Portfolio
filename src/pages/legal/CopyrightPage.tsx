import React from "react"
import {COPYRIGHT_CONTENT, COPYRIGHT_NOTICE} from "../../content/site"
import LegalDocumentPage from "./LegalDocumentPage"

const CopyrightPage: React.FC = () => {
    return (
        <LegalDocumentPage
            lead={COPYRIGHT_NOTICE}
            resumeEventSource="copyright_toolbar"
            sections={COPYRIGHT_CONTENT}
            title="Copyright"
        />
    )
}

export default CopyrightPage
