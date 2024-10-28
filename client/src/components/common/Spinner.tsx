import React from "react";
import { Oval } from "react-loader-spinner";

interface SpinnerProps {
    size: number;
}

export default function Spinner(props: SpinnerProps) {
    return <Oval visible color="#713FFA" ariaLabel="spinner" width={props.size} height={props.size} />;
}
