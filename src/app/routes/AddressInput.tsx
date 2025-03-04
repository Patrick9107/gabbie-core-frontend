import React, {useEffect, useState} from "react";
import {Button, TextField} from "@mui/material";
import {Order} from "../../domain/Order.ts";


interface AddressInputProps {
    initialOrders?: Order[];  
    onSubmit: (orders: Order[]) => void;
}

const AddressInput: React.FC<AddressInputProps> = ({ initialOrders = [], onSubmit }) => {
    const [inputText, setInputText] = useState<string>("");

    useEffect(() => {
        if (initialOrders.length > 0) {
            setInputText(initialOrders.map(order => order.address).join("\n"));
        }
    }, [initialOrders]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value);
    };

    const handleSubmit = () => {
        const addressLines = inputText
            .split("\n")
            .map(line => line.trim())
            .filter(line => line !== "");
        
        const updatedOrders = initialOrders.filter(order => addressLines.includes(order.address));

        onSubmit(updatedOrders);
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
};

export default AddressInput;
