import React from "react";
import styles from "./HomeCard.module.scss";

interface HomeCardProps {
    children: React.ReactNode;
    header: string;
}

export default function HomeCard(props: HomeCardProps) {
    return (
        <div className={styles.card}>
            <h2 className={styles.header}>{props.header}</h2>
            <div className={styles.children}>{props.children}</div>
        </div>
    );
}
