import React from 'react';
import { Button } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { profilerData } from '../utils/profilerData';

function DownloadProfilerData() {
    const handleDownload = () => {
        if (profilerData.length === 0) {
            alert("No profile data available to download.");
            return;
        }

        const jsonData = JSON.stringify(profilerData, null, 2)

        const blob = new Blob([jsonData], { type: 'application/json' })

        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url;
        a.download = 'profilerData.json'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    };

    return (
        <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
        >
            Download Profiler Data
        </Button>
    );
}

export default DownloadProfilerData;
