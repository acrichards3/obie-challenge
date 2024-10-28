import React from "react";
import styles from "./Dropdown.module.scss";
import { MultiSelect } from "react-multi-select-component";
import { useQuery } from "@tanstack/react-query";

type DropdownFn<T extends string> = () => Promise<
    ({
        id: number;
    } & Record<T, string>)[]
>;

export type DropdownOption = { label: string; value: number };

interface DropdownProps<T extends string> {
    labelledBy: string;
    label: string;
    labelKey: T;
    queryFn: DropdownFn<T>;
    queryKey: string[];
    selected: DropdownOption[];
    setSelected: React.Dispatch<React.SetStateAction<DropdownOption[]>>;
}

export default function Dropdown<T extends string>(props: DropdownProps<T>) {
    const { data, isLoading, isError } = useQuery({
        queryFn: () => props.queryFn(),
        queryKey: props.queryKey,
    });

    const options: DropdownOption[] = data?.map((item) => ({ label: item[props.labelKey], value: item.id })) ?? [];

    return (
        <MultiSelect
            className={styles.dropdown}
            options={options}
            hasSelectAll={false}
            disabled={isLoading || isError}
            value={props.selected}
            onChange={props.setSelected}
            overrideStrings={{ selectSomeItems: isError ? "Error loading items" : props.label }}
            labelledBy={props.labelledBy}
        />
    );
}
