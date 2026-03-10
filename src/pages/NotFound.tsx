import React from "react"
import {Link} from "react-router-dom"
import styles from "./NotFound.module.scss"
import {trackResumeClick} from "../utils/analytics"

const NotFound: React.FC = () => {
    return (
        <section className={styles.notFound}>
            <div className={styles.panel}>
                <p className={styles.eyebrow}>404</p>
                <h1 className={styles.title}>Page not found</h1>
                <p className={styles.description}>
                    This route does not exist in the portfolio. Use the main page sections or open the resume.
                </p>
                <div className={styles.actions}>
                    <Link className={styles.primaryAction} to="/">
                        Back to portfolio
                    </Link>
                    <Link className={styles.secondaryAction} to="/resume" onClick={() => trackResumeClick("open_route", "not_found")}>
                        Open resume
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default NotFound
