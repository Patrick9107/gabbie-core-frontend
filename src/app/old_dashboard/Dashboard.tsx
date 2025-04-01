import { Grid, Paper, Box, Typography} from "@mui/material";
import Timesheet from "./Timesheet.tsx";
import OrderStats from "./OrderStats.tsx";
import OrderList from "./OrderList.tsx";
import DailyRecords from "./DailyRecords.tsx";
import DailyOrders from "./DailyOrders.tsx";

function Dashboard() {
    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={4}>
                    <Timesheet />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <OrderStats />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <DailyOrders />
                </Grid>
                <Grid item xs={12}>
                    <OrderList />
                </Grid>
                <Grid item xs={12}>
                    <DailyRecords />
                </Grid>
            </Grid>
        </Box>
    );
}

export default Dashboard;
