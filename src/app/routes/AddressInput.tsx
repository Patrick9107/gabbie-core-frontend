import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

function AddressInput({ onSubmit }: { onSubmit: (addresses: string[]) => void }) {
    const [inputText, setInputText] = useState<string>("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value);
    };

    const handleSubmit = () => {
        const addresses = inputText.split('\n').map(address => address.trim()).filter(address => address !== "");
        onSubmit(addresses);
    };

    return (
        <div>
            <TextField
                label="Adressen"
                multiline
                rows={15} 
                value={inputText}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                margin="normal"
            />
            <Button onClick={handleSubmit} variant="contained" color="success">
                Route generieren
            </Button>
        </div>
    );
}

export default AddressInput;