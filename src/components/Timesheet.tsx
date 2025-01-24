import { Paper, Typography, CircularProgress, Box, Button } from "@mui/material";

function Timesheet() {
    return (
        <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Timesheet</Typography>
            <Typography variant="subtitle1">11 Mar 2024</Typography>
            <Box sx={{ position: "relative", display: "inline-flex", mt: 2 }}>
                <CircularProgress variant="determinate" value={70} size={80} />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: "absolute",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Typography variant="h6">3.45 hrs</Typography>
                </Box>
            </Box>
            <Button variant="contained" sx={{ mt: 2 }}>
                Punch Out
            </Button>
        </Paper>
    );
}

export default Timesheet;