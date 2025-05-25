import { Grid, Box, Paper, Typography, useTheme } from "@mui/material";
import { useEffect, lazy, Suspense } from "react";

// Importiere die Komponenten mit React.lazy
const Timesheet = lazy(() => import("./Timesheet.tsx"));
const OrderStats = lazy(() => import("./OrderStats.tsx"));
const OrderList = lazy(() => import("./OrderList.tsx"));
const DailyRecords = lazy(() => import("./DailyRecords.tsx"));
const DailyOrders = lazy(() => import("./DailyOrders.tsx"));
const VehicleContainer = lazy(() => import("./VehicleContainer.tsx"));

// Fallback-Komponente
const LoadingFallback = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <Typography>Lade Dashboard-Inhalte...</Typography> {/* Evtl. einen Spinner hier */}
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

function Dashboard() {
    useEffect(() => {
        document.title = "Übersicht | GABBIE"; // Aussagekräftiger Titel
    }, []);

    const theme = useTheme();

    return (
        <Box sx={{
            p: { xs: 2, sm: 3, md: 4 }, // Großzügigerer Abstand zur Seite
            backgroundColor: theme.palette.mode === 'light' ? '#f4f6f8' : theme.palette.background.default, // Heller Hintergrund für die Seite
            minHeight: '100vh'
        }}>
            <Suspense fallback={<LoadingFallback />}>
                <Grid container spacing={{ xs: 2, md: 4 }}> {/* Mehr Abstand zwischen den Grid-Items */}

                    {/* Hero-Sektion / Wichtigste Info */}
                    <Grid item xs={12} md={7} lg={8}>
                        <ModernCard sx={{
                            // Spezielles Styling für die Hero-Karte, z.B. ein Akzent
                            // backgroundColor: theme.palette.primary.main,
                            // color: theme.palette.primary.contrastText,
                        }}>
                            {/* Timesheet könnte hier als prominente Zahl/Info stehen */}
                            {/* Du müsstest Timesheet anpassen, um diesen Stil zu unterstützen */}
                            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Nächstes Liefer-Wochenende
                            </Typography>
                            <Timesheet />
                        </ModernCard>
                    </Grid>

                    <Grid item xs={12} md={5} lg={4}>
                        <ModernCard>
                            <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'medium' }}>
                                Top Produkte
                            </Typography>
                            <OrderStats />
                        </ModernCard>
                    </Grid>

                    {/* Weitere wichtige Kennzahlen oder Übersichten */}
                    <Grid item xs={12} md={6} lg={4}>
                        <ModernCard>
                            <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'medium' }}>
                                Letzte Bestellungen
                            </Typography>
                            <DailyOrders />
                        </ModernCard>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <ModernCard>
                            <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'medium' }}>
                                Fahrzeugübersicht
                            </Typography>
                            <VehicleContainer />
                        </ModernCard>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <ModernCard>
                            <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'medium' }}>
                                Tägliche Aufzeichnungen
                            </Typography>
                            <DailyRecords />
                        </ModernCard>
                    </Grid>


                    {/* Detailansichten / Tabellen - nehmen oft volle Breite ein */}
                    <Grid item xs={12}>
                        <ModernCard>
                            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                Bestellübersicht
                            </Typography>
                            <OrderList />
                        </ModernCard>
                    </Grid>


                </Grid>
            </Suspense>
        </Box>
    );
}

export default Dashboard;