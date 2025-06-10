import { Grid, Box, Paper, Typography, useTheme } from "@mui/material";
import { useEffect, lazy, Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress";

// Importiere die Komponenten mit React.lazy
const Timesheet = lazy(() => import("./Timesheet.tsx"));
const OrderStats = lazy(() => import("./OrderStats.tsx"));
const OrderList = lazy(() => import("./OrderList.tsx"));
const DailyRecords = lazy(() => import("./DailyRecords.tsx"));
const DailyOrders = lazy(() => import("./DailyOrders.tsx"));
const VehicleContainer = lazy(() => import("./VehicleContainer.tsx"));

// Fallback-Komponente während des Ladens
const LoadingFallback = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '150px' }}>
        <CircularProgress />
    </Box>
);

// Styling-Wrapper für Karten, um Konsistenz zu gewährleisten
const ModernCard = ({ children, sx }: { children: React.ReactNode, sx?: object }) => (
    <Paper
        elevation={3} // Subtiler Schatten
        sx={{
            p: 3, // Mehr Innenabstand
            borderRadius: '12px', // Stärkere Abrundung
            height: '100%', // Damit Karten in einer Reihe gleiche Höhe haben
            display: 'flex',
            flexDirection: 'column',
            ...sx
        }}
    >
        {children}
    </Paper>
);

function DashboardPage() { // Umbenannt, um Verwechslung zu vermeiden
    useEffect(() => {
        document.title = "Übersicht | GABBIE";
    }, []);

    const theme = useTheme();

    return (
        <Box sx={{
            p: { xs: 2, sm: 3, md: 4 }, // Großzügigerer Abstand zur Seite
            backgroundColor: theme.palette.mode === 'light' ? '#f4f6f8' : theme.palette.background.default, // Heller Hintergrund
            minHeight: '100vh'
        }}>
            {/* Suspense ist der Lade-Container für alle lazy-geladenen Komponenten */}
            <Suspense fallback={<p>Lade Dashboard...</p>}>
                <Grid container spacing={{ xs: 2, md: 4 }}>

                    {/* Hero-Sektion / Wichtigste Info */}
                    <Grid item xs={12} md={7} lg={8}>
                        <ModernCard>
                            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Nächstes Liefer-Wochenende
                            </Typography>
                            <Suspense fallback={<LoadingFallback />}>
                                <Timesheet />
                            </Suspense>
                        </ModernCard>
                    </Grid>

                    <Grid item xs={12} md={5} lg={4}>
                        <ModernCard>
                            <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'medium' }}>
                                Top Produkte
                            </Typography>
                            <Suspense fallback={<LoadingFallback />}>
                                <OrderStats />
                            </Suspense>
                        </ModernCard>
                    </Grid>

                    {/* Weitere wichtige Kennzahlen oder Übersichten */}
                    <Grid item xs={12} md={6} lg={4}>
                        <ModernCard>
                            <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'medium' }}>
                                Letzte Bestellungen
                            </Typography>
                            <Suspense fallback={<LoadingFallback />}>
                                <DailyOrders />
                            </Suspense>
                        </ModernCard>
                    </Grid>

                    {/* HIER WIRD UNSERE NEUE KOMPONENTE EINGEBUNDEN */}
                    <Grid item xs={12} md={6} lg={4}>
                        <ModernCard>
                            <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'medium' }}>
                                Fahrzeugübersicht
                            </Typography>
                            {/* Suspense fängt das verzögerte Laden von VehicleContainer auf */}
                            <Suspense fallback={<LoadingFallback />}>
                                <VehicleContainer />
                            </Suspense>
                        </ModernCard>
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <ModernCard>
                            <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'medium' }}>
                                Tägliche Aufzeichnungen
                            </Typography>
                            <Suspense fallback={<LoadingFallback />}>
                                <DailyRecords />
                            </Suspense>
                        </ModernCard>
                    </Grid>

                    {/* Detailansichten / Tabellen */}
                    <Grid item xs={12}>
                        <ModernCard>
                            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                Bestellübersicht
                            </Typography>
                            <Suspense fallback={<LoadingFallback />}>
                                <OrderList />
                            </Suspense>
                        </ModernCard>
                    </Grid>

                </Grid>
            </Suspense>
        </Box>
    );
}

export default DashboardPage;