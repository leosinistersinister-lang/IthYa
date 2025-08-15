import { GoogleGenAI, Type } from "@google/genai";
import type { HomeLayout } from '../types';

if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const schema: any = {
    type: Type.OBJECT,
    properties: {
        rooms: {
            type: Type.ARRAY,
            description: "List of all rooms in the house.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: {
                        type: Type.STRING,
                        description: "Name of the room, e.g., 'Living Room'."
                    },
                    gridPosition: {
                        type: Type.OBJECT,
                        description: "The starting position of the room on a 12-column grid.",
                        properties: {
                            row: { type: Type.INTEGER, description: "Starting row number." },
                            col: { type: Type.INTEGER, description: "Starting column number (1-12)." }
                        }
                    },
                    gridSpan: {
                        type: Type.OBJECT,
                        description: "How many rows and columns the room occupies.",
                        properties: {
                            rowSpan: { type: Type.INTEGER, description: "Number of rows to span." },
                            colSpan: { type: Type.INTEGER, description: "Number of columns to span." }
                        }
                    },
                    devices: {
                        type: Type.ARRAY,
                        description: "List of smart devices in this room.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.STRING, description: "A unique ID for the device, e.g., 'living-room-light-1'." },
                                name: { type: Type.STRING, description: "A descriptive name for the device, e.g., 'Main Ceiling Light'." },
                                type: {
                                    type: Type.STRING,
                                    enum: ['light', 'camera', 'switch', 'thermostat', 'speaker', 'tv'],
                                    description: "The type of the smart device."
                                },
                                state: {
                                    type: Type.STRING,
                                    description: "Initial state of the device. 'off' for most, a temperature for thermostats.",
                                    default: "off"
                                },
                                brightness: {
                                    type: Type.INTEGER,
                                    description: "For lights only. Brightness percentage from 0 to 100. Defaults to 100."
                                },
                                color: {
                                    type: Type.STRING,
                                    description: "For lights only. Color in hex format (e.g., '#FFFFFF'). Defaults to '#FFFFFF'."
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};


export const generateHomeLayout = async (description: string): Promise<HomeLayout | null> => {
    try {
        const prompt = `You are an expert home architect and automation planner. Based on the user's description of their home, generate a JSON object representing a simplified 2D grid-based floor plan.
        The user's description is: "${description}".
        The grid is 12 columns wide. You must determine the appropriate gridPosition (col, row) and gridSpan (colSpan, rowSpan) for each room to create a logical and visually appealing layout that resembles a real house plan.
        The gridPosition.col must be between 1 and 12. Also, identify any smart devices mentioned and place them inside their respective rooms with unique IDs.
        For all 'light' type devices, you must also provide 'brightness' (integer 0-100, default 100) and 'color' (hex string, default '#FFFFFF') properties.
        Adhere strictly to the provided JSON schema. Ensure the final output is a single, valid JSON object.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        
        const jsonText = response.text.trim();
        const layout = JSON.parse(jsonText) as HomeLayout;

        // Basic validation
        if (layout && Array.isArray(layout.rooms)) {
            return layout;
        }
        return null;

    } catch (error) {
        console.error("Error generating home layout:", error);
        return null;
    }
};