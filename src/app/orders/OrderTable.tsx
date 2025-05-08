import React, { useState, Fragment, useMemo } from 'react';
import {
    Table, TableBody, TableCell, TableHead, TableRow, IconButton, Collapse, Box, Button, Paper, Typography, Checkbox,
    TableContainer, Alert, Stack, Tooltip, TableSortLabel, useTheme
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RouteIcon from '@mui/icons-material/Route';
import { OrderStatus } from "../../domain/enums/OrderStatus.ts";
import { OrderSource } from "../../domain/enums/OrderSource.ts";
import { OrderResponse } from "../../domain/OrderResponse.ts";
import { useNavigate } from "react-router-dom";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import 'dayjs/locale/de';
import dayjs, { Dayjs } from 'dayjs';

type OrderSortKey = 'phoneNumber' | 'address' | 'totalAmount' | 'deliveryDate';
type SortDirection = 'asc' | 'desc';

interface Props {
    orders: OrderResponse[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

const getOrderStatusLabel = (status: number | undefined | null): string => {
    return status !== null && status !== undefined ? OrderStatus[status] || 'Unbekannt' : 'Unbekannt';
}
const getOrderSourceLabel = (source: number | undefined | null): string => {
    return source !== null && source !== undefined ? OrderSource[source] || 'Unbekannt' : 'Unbekannt';
}


const OrderTable = ({ orders, onEdit, onDelete }: Props) => {
    const theme = useTheme();
    const [openRows, setOpenRows] = useState(new Map<number, boolean>());
    const [selecting, setSelecting] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
    const [filterDate, setFilterDate] = useState<Dayjs | null>(null);
    const navigate = useNavigate();
    const [sortOptions, setSortOptions] = useState<{ key: OrderSortKey; direction: SortDirection } | null>(null);

    const handleSortRequest = (property: OrderSortKey) => {
        if (!sortOptions || sortOptions.key !== property) {
            setSortOptions({ key: property, direction: 'asc' });
        } else if (sortOptions.direction === 'asc') {
            setSortOptions({ key: property, direction: 'desc' });
        } else {
            setSortOptions(null);
        }
    };

    const filteredOrders = useMemo(() => {
        return filterDate
            ? orders.filter(order => {
                if (!order.deliveryDate) return false;
                return dayjs(order.deliveryDate).isSame(filterDate, 'day');
            })
            : orders;
    }, [orders, filterDate]);

    const sortedOrders = useMemo(() => {
        const ordersToSort = [...filteredOrders];
        if (sortOptions) {
            ordersToSort.sort((a, b) => {
                let aValue: string | number | null = null;
                let bValue: string | number | null = null;

                switch (sortOptions.key) {
                    case 'deliveryDate':
                        aValue = a.deliveryDate ? dayjs(a.deliveryDate).valueOf() : null;
                        bValue = b.deliveryDate ? dayjs(b.deliveryDate).valueOf() : null;
                        if (aValue === null) aValue = sortOptions.direction === 'asc' ? Infinity : -Infinity;
                        if (bValue === null) bValue = sortOptions.direction === 'asc' ? Infinity : -Infinity;
                        break;
                    case 'totalAmount':
                        aValue = a.totalAmount ?? 0;
                        bValue = b.totalAmount ?? 0;
                        break;
                    case 'phoneNumber':
                        aValue = a.phoneNumber?.trim() ?? '';
                        bValue = b.phoneNumber?.trim() ?? '';
                        break;
                    case 'address':
                        aValue = a.address?.trim() ?? '';
                        bValue = b.address?.trim() ?? '';
                        break;
                    default: return 0;
                }

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortOptions.direction === 'asc'
                        ? aValue.localeCompare(bValue, 'de')
                        : bValue.localeCompare(aValue, 'de');
                } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortOptions.direction === 'asc'
                        ? aValue - bValue
                        : bValue - aValue;
                }
                return 0;
            });
        }
        return ordersToSort;
    }, [filteredOrders, sortOptions]);

    const isOrderIncomplete = (order: OrderResponse): boolean => {
        return !order.phoneNumber?.trim() || !order.address?.trim() || order.orderItems.length === 0 || !order.deliveryDate;
    };

    const uncompletedOrdersMap = useMemo(() => {
        const map = new Map<number, boolean>();
        orders.forEach(o => {
            if (isOrderIncomplete(o)) {
                map.set(o.id, true);
            }
        });
        return map;
    }, [orders]);


    const toggleRow = (id: number) => {
        if (selecting) return;
        setOpenRows(prev => {
            const newMap = new Map(prev);
            newMap.set(id, !newMap.get(id));
            return newMap;
        });
    };

    const toggleOrderSelection = (id: number) => {
        setSelectedOrders(prev =>
            prev.includes(id) ? prev.filter(orderId => orderId !== id) : [...prev, id]
        );
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = sortedOrders.map((n) => n.id);
            setSelectedOrders(newSelecteds);
            return;
        }
        setSelectedOrders([]);
    };


    const handleRouteCalculation = () => {
        const selectedOrdersData = orders.filter(order => selectedOrders.includes(order.id));
        navigate(`/routes`, { state: { orders: selectedOrdersData } });
    };

    const getRowBackgroundColor = (orderId: number): string => {
        if (selectedOrders.includes(orderId)) {
            return theme.palette.action.selected;
        }
        return 'inherit';
    };

    const headerCellSx = useMemo(() => ({
        py: 1.5,
        backgroundColor: '#3d9970',
        color: '#ffffff',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        '& .MuiTableSortLabel-root': {
            color: '#ffffff !important',
            '&:hover': {
                color: '#ffffff',
            },
            '&.Mui-active': {
                color: '#ffffff',
            }
        },
        '& .MuiTableSortLabel-icon': {
            color: '#ffffff !important',
        }
    }), [theme]);

    const nonSortableHeaderCellSx = useMemo(() => ({
        py: 1,
        backgroundColor: '#3d9970',
        color: '#ffffff',
        fontWeight: 'bold',
        whiteSpace: 'nowrap'
    }), [theme]);

    const sumSx = {
        borderBottom: "none",
        fontWeight: "bold",
        pt: 1
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
            <Paper sx={{ overflow: "hidden", borderRadius: theme.shape.borderRadius * 1.5, boxShadow: 3 }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                    sx={{ p: 2 }}
                >
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Button
                            variant="outlined"
                            size="small"
                            color={selecting ? "secondary" : "primary"}
                            onClick={() => {
                                setSelecting(prev => {
                                    if (prev) setSelectedOrders([]);
                                    return !prev;
                                });
                            }}
                        >
                            {selecting ? "Auswahl beenden" : "Auswählen"}
                        </Button>
                        {selecting && (
                            <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                startIcon={<RouteIcon />}
                                onClick={handleRouteCalculation}
                                disabled={selectedOrders.length === 0}
                            >
                                Route berechnen ({selectedOrders.length})
                            </Button>
                        )}
                    </Stack>
                    <DatePicker
                        label="Filter Lieferdatum"
                        value={filterDate}
                        onChange={(newValue) => setFilterDate(newValue)}
                        slotProps={{ textField: { size: 'small' } }}
                        sx={{ maxWidth: { xs: '100%', sm: '200px' } }}
                        format="DD.MM.YYYY"
                    />
                </Stack>

                <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
                    <Table stickyHeader sx={{ minWidth: 750 }} size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox" sx={nonSortableHeaderCellSx}>
                                    {selecting ? (
                                        <Tooltip title="Alle auswählen">
                                            <Checkbox
                                                sx={{color: theme.palette.primary.contrastText}}
                                                indeterminate={selectedOrders.length > 0 && selectedOrders.length < sortedOrders.length}
                                                checked={sortedOrders.length > 0 && selectedOrders.length === sortedOrders.length}
                                                onChange={handleSelectAllClick}
                                                slotProps={{ input: { "aria-label": 'Alle Bestellungen auswählen' } }}
                                            />
                                        </Tooltip>
                                    ) : <Box sx={{width: 40}}/>}
                                </TableCell>
                                <TableCell sx={nonSortableHeaderCellSx}>Details</TableCell>

                                <TableCell
                                    sx={headerCellSx}
                                    sortDirection={sortOptions?.key === 'phoneNumber' ? sortOptions.direction : false}
                                    onClick={() => handleSortRequest('phoneNumber')}
                                >
                                    <TableSortLabel
                                        active={sortOptions?.key === 'phoneNumber'}
                                        direction={sortOptions?.key === 'phoneNumber' ? sortOptions.direction : 'asc'}
                                    >
                                        Telefon
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell
                                    sx={headerCellSx}
                                    sortDirection={sortOptions?.key === 'address' ? sortOptions.direction : false}
                                    onClick={() => handleSortRequest('address')}
                                >
                                    <TableSortLabel
                                        active={sortOptions?.key === 'address'}
                                        direction={sortOptions?.key === 'address' ? sortOptions.direction : 'asc'}
                                    >
                                        Adresse
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell
                                    sx={headerCellSx}
                                    sortDirection={sortOptions?.key === 'totalAmount' ? sortOptions.direction : false}
                                    onClick={() => handleSortRequest('totalAmount')}
                                >
                                    <TableSortLabel
                                        active={sortOptions?.key === 'totalAmount'}
                                        direction={sortOptions?.key === 'totalAmount' ? sortOptions.direction : 'asc'}
                                    >
                                        Preis
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell
                                    sx={headerCellSx}
                                    sortDirection={sortOptions?.key === 'deliveryDate' ? sortOptions.direction : false}
                                    onClick={() => handleSortRequest('deliveryDate')}
                                >
                                    <TableSortLabel
                                        active={sortOptions?.key === 'deliveryDate'}
                                        direction={sortOptions?.key === 'deliveryDate' ? sortOptions.direction : 'asc'}
                                    >
                                        Lieferdatum
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="right" sx={nonSortableHeaderCellSx}>Aktionen</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedOrders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <Alert severity="info" variant="outlined" sx={{ justifyContent: 'center', my: 3, border: 'none' }}>
                                            Keine Bestellungen gefunden{filterDate ? ' für das ausgewählte Datum' : ''}.
                                        </Alert>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedOrders.map(order => (
                                    <Fragment key={order.id}>
                                        <TableRow
                                            hover={!selecting}
                                            sx={{
                                                backgroundColor: getRowBackgroundColor(order.id),
                                                cursor: selecting ? 'default' : 'pointer',
                                                '&:hover': {
                                                    backgroundColor: !selecting ? theme.palette.action.hover : undefined
                                                },
                                                borderLeft: uncompletedOrdersMap.has(order.id) ? `4px solid ${theme.palette.warning.main}` : 'none',
                                            }}
                                            onClick={() => !selecting && toggleRow(order.id)}
                                        >
                                            <TableCell padding="checkbox">
                                                {selecting && (
                                                    <Checkbox
                                                        color="primary"
                                                        checked={selectedOrders.includes(order.id)}
                                                        onChange={() => toggleOrderSelection(order.id)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        slotProps={{ input: { 'aria-labelledby': `select-order-${order.id}` } }}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell sx={{ position: 'relative', textAlign: 'center', px: 1 }}>

                                                {uncompletedOrdersMap.has(order.id) && !selecting && (
                                                    <Tooltip title="Bestellung unvollständig (fehlende Adresse, Telefonnr., Produkte oder Lieferdatum)">
                                                        <Box
                                                            sx={{
                                                                position: 'absolute',
                                                                left: theme.spacing(1),
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                display: 'inline-flex',
                                                                color: theme.palette.warning.main,
                                                            }}
                                                        >
                                                            <WarningAmberIcon fontSize="small" />
                                                        </Box>
                                                    </Tooltip>
                                                )}

                                                {!selecting && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => { e.stopPropagation(); toggleRow(order.id); }}
                                                    >
                                                        {openRows.get(order.id) ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                    </IconButton>
                                                )}

                                            </TableCell>
                                            <TableCell>{order.phoneNumber || '-'}</TableCell>
                                            <TableCell>{order.address || '-'}</TableCell>
                                            <TableCell>{order.totalAmount?.toFixed(2)}€</TableCell>
                                            <TableCell>
                                                {order.deliveryDate
                                                    ? dayjs(order.deliveryDate).format('DD.MM.YYYY')
                                                    : <Typography variant="caption" color="textSecondary">Kein Datum</Typography>
                                                }
                                            </TableCell>
                                            <TableCell align="right" sx={{whiteSpace: 'nowrap'}}>
                                                <Tooltip title="Bearbeiten">
                                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit(order.id); }}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Löschen">
                                                    <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onDelete(order.id); }}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                        {!selecting && (
                                            <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
                                                <TableCell colSpan={7} sx={{ p: 0, borderBottom: 'none' }}>
                                                    <Collapse in={openRows.get(order.id)} timeout="auto" unmountOnExit>
                                                        <Box sx={{ px: 3, py: 2 }}>
                                                            <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'medium', mb: 2 }}>
                                                                Bestelldetails
                                                            </Typography>
                                                            <Stack direction={{xs: 'column', md: 'row'}} spacing={{xs: 1, md: 4}} mb={2}>
                                                                <Box>
                                                                    <Typography variant="body2" color="textSecondary">Status</Typography>
                                                                    <Typography variant="body1">{getOrderStatusLabel(order.orderStatus)}</Typography>
                                                                </Box>
                                                                <Box>
                                                                    <Typography variant="body2" color="textSecondary">Quelle</Typography>
                                                                    <Typography variant="body1">{getOrderSourceLabel(order.orderSource)}</Typography>
                                                                </Box>
                                                                <Box sx={{ flexGrow: 1 }}>
                                                                    <Typography variant="body2" color="textSecondary">Notiz</Typography>
                                                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>{order.note || '-'}</Typography>
                                                                </Box>
                                                            </Stack>

                                                            <Table size="small" aria-label="order items" sx={{backgroundColor: theme.palette.background.paper, borderRadius: theme.shape.borderRadius }}>
                                                                <TableHead>
                                                                    <TableRow sx={{ '& th': {fontWeight: 'medium'}}}>
                                                                        <TableCell>Produkt</TableCell>
                                                                        <TableCell align="right">Menge</TableCell>
                                                                        <TableCell align="right">Einzelpreis</TableCell>
                                                                        <TableCell align="right">Gesamt</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {order.orderItems?.map((item, index) => (
                                                                        <TableRow key={`${order.id}-item-${index}`} sx={{'&:last-child td, &:last-child th': { border: 0 }}}>
                                                                            <TableCell component="th" scope="row">{item.product?.name ?? 'Unbekannt'}</TableCell>
                                                                            <TableCell align="right">{item.quantity}</TableCell>
                                                                            <TableCell align="right">{item.product?.price?.toFixed(2) ?? '0.00'}€</TableCell>
                                                                            <TableCell align="right">{(item.quantity * (item.product?.price ?? 0)).toFixed(2)}€</TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                    <TableRow><TableCell colSpan={4} sx={{py: 0.5, border: 'none'}}></TableCell></TableRow>
                                                                    <TableRow>
                                                                        <TableCell colSpan={2} sx={sumSx}></TableCell>
                                                                        <TableCell align="right" sx={{...sumSx, borderBottom: 'none'}}>Summe:</TableCell>
                                                                        <TableCell align="right" sx={{...sumSx, borderBottom: 'none'}}>{order.totalAmount?.toFixed(2) ?? '0.00'}€</TableCell>
                                                                    </TableRow>
                                                                </TableBody>
                                                            </Table>
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </Fragment>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </LocalizationProvider>
    );
};

export default OrderTable;