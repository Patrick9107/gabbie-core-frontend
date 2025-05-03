import VehiclePanel from "./VehiclePanel";
import {Vehicle} from "../../domain/Vehicle.ts"; // Das Panel, das die Details für jedes Fahrzeug anzeigt

interface VehiclePanelListProps {
    vehicles: Vehicle[]; // Fahrzeugdaten, die von der Container-Komponente übergeben werden
}

const VehiclePanelList = ({ vehicles }: VehiclePanelListProps) => {
    return (
        <div>
            <h2>Fahrzeuge</h2>
            {vehicles.length > 0 ? (
                vehicles.map((vehicle) => (
                    <VehiclePanel key={vehicle.id} vehicle={vehicle} />
                ))
            ) : (
                <p>Keine Fahrzeuge gefunden</p>
            )}
        </div>
    );
};

export default VehiclePanelList;
