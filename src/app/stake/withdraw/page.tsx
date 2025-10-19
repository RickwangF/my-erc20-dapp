'use client';

import styles from "@/app/stake/stake.module.css";
import Button from "@mui/material/Button";
import {useState} from "react";

export default function Page() {

    const [stakeAmount, setStakeAmount] = useState('0.00');

    return(
        <div className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <div className={styles.whiteBorderContainer}>
                <p className="text-white text-base p-3">
                    Available to Withdraw: { stakeAmount }
                </p>
            </div>
        </div>
    );
}