import React from "react";
import Dropdown from "../common/Dropdown";
import Providers from "./providers/Providers";
import ObieLogo from "~/assets/images/logo-color.svg";
import HomeCard from "./card/HomeCard";
import styles from "./Home.module.scss";
import { useQuery } from "@tanstack/react-query";
import { queryLocation } from "~/api/queryLocation";
import { queryPolicy } from "~/api/queryPolicy";
import { queryCarrier } from "../../api/queryCarrier";
import type { DropdownOption } from "../common/Dropdown";

export default function Home() {
    const [locations, setLocations] = React.useState<DropdownOption[]>([]);
    const [policyTypes, setPolicyTypes] = React.useState<DropdownOption[]>([]);

    const isCarriersEnabled = locations.length > 0 && policyTypes.length > 0;
    const carriers = useQuery({
        enabled: isCarriersEnabled,
        queryFn: () =>
            queryCarrier(
                locations.map((location) => location.value),
                policyTypes.map((policy) => policy.value),
            ),
        queryKey: ["queryCarrier", locations, policyTypes],
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <a aria-label="Go to Obie Insurance home page" href="https://www.obieinsurance.com/">
                    <img className={styles.logo} src={ObieLogo} alt="Obie Logo" />
                </a>
            </div>
            <div className={styles.cards}>
                <HomeCard header="Select States">
                    <Dropdown
                        label="Select locations..."
                        labelledBy="Location Selector"
                        labelKey="location"
                        queryFn={queryLocation}
                        queryKey={["queryLocation"]}
                        selected={locations}
                        setSelected={setLocations}
                    />
                </HomeCard>
                <HomeCard header="Select Policy Types">
                    <Dropdown
                        label="Select policy types..."
                        labelledBy="Policy Selector"
                        labelKey="policy"
                        queryFn={queryPolicy}
                        queryKey={["queryPolicy"]}
                        selected={policyTypes}
                        setSelected={setPolicyTypes}
                    />
                </HomeCard>
                <HomeCard header="Available Providers">
                    <Providers providers={isCarriersEnabled ? carriers : null} />
                </HomeCard>
            </div>
        </div>
    );
}
