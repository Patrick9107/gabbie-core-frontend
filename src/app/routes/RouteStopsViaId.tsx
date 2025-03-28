export async function getStopsByRouteId(routeId: number): Promise<any[]> {
    try {
        const response = await fetch(`/api/routes/${routeId}/stops`);
        if (!response.ok) throw new Error("Fehler beim Laden der Stops");
        return await response.json();
    } catch (error) {
        console.error("Error fetching stops:", error);
        return [];
    }
}

// das brauche ich vielleicht später