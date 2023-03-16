import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    inputData : null
}

const ulbdataSlice = createSlice({
    name            : 'ulbdata',
    initialState    : initialState,
    reducers        : {
        storeInput(state, action){
            
            let data = action.payload;
           console.log("Data", data);
            state.inputData = {
                ... state.inputData,
               [data.name] : data.value
            }
        },
        resetInput(state){
            state.inputData = null;
        }
    }
});

export const ulbdataActions = ulbdataSlice.actions;
export default ulbdataSlice;
