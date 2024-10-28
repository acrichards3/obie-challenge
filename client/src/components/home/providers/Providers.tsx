import React from "react";
import Spinner from "~/components/common/Spinner";
import styles from "./Providers.module.scss";
import type { UseQueryResult } from "@tanstack/react-query";

interface ProvidersProps {
    providers: UseQueryResult<string[], Error> | null;
}

export default function Providers(props: ProvidersProps) {
    const sortedProviders = React.useMemo(() => {
        return [...(props.providers?.data ?? [])].sort();
    }, [props.providers]);

    return (
        <div className={styles.container}>
            {props.providers === null ? (
                <span className={styles.center}>
                    Choose locations and policy types to view a list of available providers
                </span>
            ) : props.providers.isLoading ? (
                <div className={styles.center}>
                    <Spinner size={50} />
                </div>
            ) : props.providers.isError ? (
                <span className={styles.center}>Error fetching providers</span>
            ) : props.providers.data?.length === 0 ? (
                <span className={styles.center}>No Providers Found</span>
            ) : (
                sortedProviders.map((provider) => (
                    <span key={provider} className={styles.value}>
                        {provider}
                    </span>
                ))
            )}
        </div>
    );
}
